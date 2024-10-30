import { DELETE_CAR } from "@/graphql/admin/mutations/cars/delete-car-mutation";
import { EDIT_CAR } from "@/graphql/admin/mutations/cars/edit-car";
import { GET_ALL_CARS_QUERY } from "@/graphql/admin/queries/cars/get-all-cars-query";
import { CarData, DeleteCarResponse, EditCarResponse, GetAllCarsResponse } from "@/interfaces/admin/cars";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { RcFile } from "antd/es/upload";
import Swal from "sweetalert2";

export class ManageCars {
        private client: ApolloClient<NormalizedCacheObject>;
        constructor(
            client: ApolloClient<NormalizedCacheObject>
        ) {
            this.client = client;
        }

    // fetch all cars data
    public getAllCars = async(
        setCars:(data:CarData[])=>void
    ):Promise<void> => {
        try{
            const {data} = await this.client.query<GetAllCarsResponse>({
                query: GET_ALL_CARS_QUERY,
            });

            setCars(data.getAllCars.data)

        }catch(error){
            console.error(error)
        }
    }

    // delete the car according to the id
    public deleteCar = async (
        carId:number
    ):Promise<void> => {
        try{
            Swal.fire({
                title: "Are you sure?",
                text: "Car will be deleted along with assigned rentable vehicles.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if(result.isConfirmed){
                    const {data} = await this.client.mutate<DeleteCarResponse>({
                        mutation: DELETE_CAR,
                        variables: {
                            id:carId,
                        },
                    });

                    if(data?.deleteCar.status){
                        Swal.fire({
                            title: "Deleted!",
                            text: data.deleteCar.message,
                            icon: "success",
                            showConfirmButton: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload()
                            }
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: data?.deleteCar.message,
                            icon: "error",
                            showConfirmButton: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload()
                            }
                        });
                    }
                }
            });
        }catch(error){
            console.log(error);
        }
    }

    public editCar = async(
        id: number | null,
        name: string,
        description: string,
        brandName: string | undefined,
        primaryImage: string | File | null,
        otherImages: (string | RcFile | undefined)[],
        availableQuantity: number | null,
        year: number | undefined,
        fuelType: string,
        transmissionType: string,
        numberOfSeats: number | null,
        numberOfDoors: number | null,
        pricePerDay: number
    ) => {
        try {
            // Prepare primary image input
            const primaryImageInput = {
                image: primaryImage instanceof File ? primaryImage : null,
                imageUrl: typeof primaryImage === 'string' ? primaryImage : null
            };
    
            // Prepare other images input
            const otherImagesInput = otherImages.map(img => ({
                image: img instanceof File ? img : null,
                imageUrl: typeof img === 'string' ? img : null,
            }));
    
            // Call the GraphQL mutation
            Swal.fire({
                title: "Save Changes?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Save"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { data } = await this.client.mutate<EditCarResponse>({
                        mutation: EDIT_CAR,
                        variables: {
                            id: id,
                            name: name,
                            description: description,
                            brandName: brandName,
                            primaryImage: primaryImageInput,
                            otherImages: otherImagesInput,
                            availableQuantity: availableQuantity,
                            year: year,
                            fuelType: fuelType,
                            transmissionType: transmissionType,
                            numberOfSeats: numberOfSeats,
                            numberOfDoors: numberOfDoors,
                            pricePerDay: pricePerDay
                        }
                    });

                    if (data?.editCar.status) {
                        Swal.fire({
                            title: "Saved!",
                            text: "Car has been Saved succesfully",
                            icon: "success",
                            showConfirmButton: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload()
                            }
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: data?.editCar.message,
                            icon: "error",
                            showConfirmButton: true
                        });
                    }

                }
            });

        } catch (error) {
            console.error("Error editing car:", error);
        }
    }
    
}