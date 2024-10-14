import { ADD_RENTABLE_CAR } from "@/graphql/admin/mutations/rentable-cars/add-rentable-car-mutation";
import { FETCH_RENTABLE_CAR } from "@/graphql/admin/queries/rentable-cars/fetch-rentable-car";
import { AddRentableCarResponse, FetchRentablecarsResponse, RentableModel } from "@/interfaces/rentable-cars";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import Swal from "sweetalert2";

export class AddRentablecars{
    private client: ApolloClient<NormalizedCacheObject>;
    constructor(
        client: ApolloClient<NormalizedCacheObject>
    ) {
        this.client = client;
    }

    // fetch car data for add rentables
    public fetchCar = async (
        setCarData:(data:RentableModel)=>void,
        id?:number
        ):Promise<void> => {
        try{
            const {data} = await this.client.query<FetchRentablecarsResponse>({
                query:FETCH_RENTABLE_CAR,
                variables:{id},
            })
            if(data.fetchRentablecars.status){
                setCarData(data.fetchRentablecars.data);
            }

        }catch(error){
            console.error(error);
        }
    }

    // add rentable carData
    public addrentableCar = async(
        registrationNumber:string,
        carId?:number
    ):Promise<void> => {
        try{
            const { data } = await this.client.mutate<AddRentableCarResponse>({
                mutation:ADD_RENTABLE_CAR,
                variables:{
                    registrationNumber: registrationNumber,
                    carId: carId
                }
            })


            if (data?.addRentableCar.status) {
                console.log(data)
                Swal.fire({
                    title: "Success!",
                    text: "Car added successfully",
                    icon: "success",
                    confirmButtonText: "OK",  // Use confirmButtonText instead of 'button'
                });
            } else {
                console.log(data)
                Swal.fire({
                    title: "Error",
                    text: data?.addRentableCar.message,
                    icon: "error",
                    confirmButtonText: "OK",  // Use confirmButtonText instead of 'button'
                });
            }
            window.location.reload();
        }catch(error){
            console.error(error);
        }
    }
}