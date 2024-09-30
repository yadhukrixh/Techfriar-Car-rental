import { ADD_VEHICLE } from "@/graphql/admin/mutations/add-vehicles";
import { BRANDS_QUERY } from "@/graphql/admin/queries/brands-query";
import { Brand } from "@/interfaces/popular-brands";
import { AddVehicleResponse, GetBrandsResponse } from "@/interfaces/vehicles";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { message } from "antd";

export class AddVehicleClass {
    // Fetch brands data
    public fetchBrands = async (
        client: ApolloClient<NormalizedCacheObject>,
        setBrands: (data: Brand[]) => void
    ): Promise<void> => {
        try {
            const { data } = await client.query<GetBrandsResponse>({
                query: BRANDS_QUERY,
            });

            if (data.getBrands.success) {
                const formattedBrands = data.getBrands.data.map((brand: any) => ({
                    id: Number(brand.id),         // Converting string id to number
                    logoUrl: brand.imageUrl,      // Mapping imageUrl to logoUrl
                    name: brand.name,             // Directly mapping name
                }));

                // Set the formatted data into setBrands
                setBrands(formattedBrands);
            }
        } catch (error) {
            console.error(error);
            message.error("Error fetching brands.");
        }
    };

    // Handle file changes for primary and other images
    public handleFileChange = (
        info: any,
        type: string,
        setPrimaryImage: React.Dispatch<React.SetStateAction<File | null>>,
        setOtherImages: React.Dispatch<React.SetStateAction<File[]>>
    ) => {
        const { fileList } = info; // Destructure fileList from info

        if (type === "primary") {
            if (fileList.length > 0) {
                const latestFile = fileList[0];
                setPrimaryImage(latestFile.originFileObj);
                message.success(`${latestFile.name} primary image uploaded successfully`);
            } else {
                setPrimaryImage(null); // Reset state if no files are selected
                message.info("Please select a primary image.");
            }
        } else if (type === "other") {
            if (fileList.length > 0) {
                const files = fileList.map((file: any) => file.originFileObj);
                setOtherImages(files);
                message.success("Other images uploaded successfully.");
            } else {
                setOtherImages([]); // Reset state if no other images are selected
                message.info("Please select other images.");
            }
        }
    };

    // Handle the add vehicle operation
    public handleAddVehicle = async (
        client: ApolloClient<NormalizedCacheObject>,
        vehicleName: string,
        description: string, // Add description
        primaryImage: File,
        otherImages: File[],
        selectedBrand: number,
        quantity: number,
        selectedYear: number | null,
        fuelType: string | null, // Add fuel type
        transmissionType: string | null, // Add transmission type
        seatNum:Number,
        doorNum:Number

    ): Promise<void> => {
        try {
            const { data } = await client.mutate<AddVehicleResponse>({
                mutation: ADD_VEHICLE,
                variables: {
                    input: {
                        name: vehicleName,
                        description: description, // Include description in the mutation
                        image: primaryImage,
                        additionalImages: otherImages,
                        brandId: selectedBrand,
                        quantity: quantity,
                        year: selectedYear,
                        fuelType: fuelType, // Include fuel type
                        transmissionType: transmissionType, // Include transmission type
                        numberOfSeats:seatNum,
                        numberOfDoors:doorNum
                    },
                },
            });

            if (data?.addVehicle.success) {
                message.success("Vehicle added successfully");
            } else {
                message.error("Failed to add the vehicle");
            }
        } catch (error) {
            console.error(error);
            message.error("An error occurred while adding the vehicle");
        }
    };

}
