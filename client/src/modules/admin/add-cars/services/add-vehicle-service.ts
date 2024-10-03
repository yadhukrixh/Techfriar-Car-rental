import { ADD_CAR } from "@/graphql/admin/mutations/add-car-mutation";
import { BRANDS_QUERY } from "@/graphql/admin/queries/brands-query";
import { Brand, GetBrandsResponse } from "@/interfaces/brands";
import { AddCarResponse } from "@/interfaces/vehicles";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { message } from "antd";
import Swal from "sweetalert2";

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

            if (data.getBrands.status) {
                const formattedBrands:Brand[] = data.getBrands.data.map((brand: any) => ({
                    id: Number(brand.id),         // Converting string id to number
                    logoUrl: brand.imageUrl,      // Mapping imageUrl to logoUrl
                    name: brand.name,             // Directly mapping name
                    country:brand.country,
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
                setPrimaryImage(latestFile);
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
        description: string,
        primaryImage: any, // Adjust to handle the raw file
        otherImages: any[], // Adjust to handle raw files
        selectedBrand: number,
        quantity: number,
        selectedYear: number | null,
        fuelType: string | null,
        transmissionType: string | null,
        seatNum: Number,
        doorNum: Number
    ): Promise<void> => {
        try {
            // Extract the raw file from Ant Design's Upload component
            const rawPrimaryImage = primaryImage.originFileObj || primaryImage;
            const rawOtherImages = otherImages.map((image) => image.originFileObj || image);

            const { data } = await client.mutate<AddCarResponse>({
                mutation: ADD_CAR,
                variables: {
                    name: vehicleName,
                    description: description,
                    primaryImage: rawPrimaryImage, // Use raw file
                    additionalImages: rawOtherImages, // Use array of raw files
                    brandId: selectedBrand,
                    quantity: quantity,
                    year: selectedYear,
                    fuelType: fuelType,
                    transmissionType: transmissionType,
                    numberOfSeats: seatNum,
                    numberOfDoors: doorNum,
                },
            });

            if (data?.addCar.status) {
                Swal.fire({
                    title: "Success!",
                    text: "Car added successfully",
                    icon: "success",
                    confirmButtonText: "OK",  // Use confirmButtonText instead of 'button'
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: data?.addCar.message,
                    icon: "error",
                    confirmButtonText: "OK",  // Use confirmButtonText instead of 'button'
                });
            }
        } catch (error) {
            console.error(error);
            message.error("An error occurred while adding the vehicle");
        }
    };


}
