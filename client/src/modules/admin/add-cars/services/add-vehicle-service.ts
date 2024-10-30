import { ADD_CAR } from "@/graphql/admin/mutations/cars/add-car-mutation";
import { BRANDS_QUERY } from "@/graphql/admin/queries/brands/brands-query";
import { Brand, GetBrandsResponse } from "@/interfaces/admin/brands";
import { AddCarResponse } from "@/interfaces/admin/vehicles";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { message, UploadFile } from "antd";
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
                const formattedBrands:Brand[] = data.getBrands.data.map((brand: Brand) => ({
                    id: Number(brand.id),         // Converting string id to number
                    logoUrl: brand.logoUrl,      // Mapping imageUrl to logoUrl
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
        info: {
            fileList: Array<{
                name: string;
                originFileObj: File;
            }>;
        },
        type: string,
        setPrimaryImage: React.Dispatch<React.SetStateAction<File | null>>,
        setOtherImages: React.Dispatch<React.SetStateAction<File[]>>
    ) => {
        const { fileList } = info;
    
        if (type === "primary") {
            if (fileList.length > 0) {
                const latestFile = fileList[0].originFileObj;  // Access the originFileObj
                setPrimaryImage(latestFile);
                message.success(`${fileList[0].name} primary image uploaded successfully`);
            } else {
                setPrimaryImage(null);
                message.info("Please select a primary image.");
            }
        } else if (type === "other") {
            if (fileList.length > 0) {
                const files = fileList.map((file) => file.originFileObj);
                setOtherImages(files);
                message.success("Other images uploaded successfully.");
            } else {
                setOtherImages([]);
                message.info("Please select other images.");
            }
        }
    };

    // Handle the add vehicle operation
    public handleAddVehicle = async (
        client: ApolloClient<NormalizedCacheObject>,
        vehicleName: string,
        description: string,
        primaryImage: UploadFile, // Adjust to handle the raw file
        otherImages: UploadFile[], // Adjust to handle raw files
        selectedBrand: number,
        quantity: number,
        selectedYear: number | null,
        fuelType: string | null,
        transmissionType: string | null,
        seatNum: number,
        doorNum: number,
        pricePerDay: number
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
                    pricePerDay: pricePerDay
                },
            });

            if (data?.addCar.status) {
                Swal.fire({
                    title: "Success!",
                    text: "Car added successfully",
                    icon: "success",
                    confirmButtonText: "OK",  // Use confirmButtonText instead of 'button'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload()
                    }
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: data?.addCar.message,
                    icon: "error",
                    confirmButtonText: "OK",  // Use confirmButtonText instead of 'button'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload()
                    }
                });
            }
            
        } catch (error) {
            console.error(error);
            message.error("An error occurred while adding the vehicle");
        }
    };


}
