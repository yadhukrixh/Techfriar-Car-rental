import { ADD_RENTABLE_CAR } from "@/graphql/admin/mutations/rentable-cars/add-rentable-car-mutation";
import { CHANGE_ACTIVE_STATUS } from "@/graphql/admin/mutations/rentable-cars/change-active-status";
import { EDIT_REGISTRTION_NUMBER } from "@/graphql/admin/mutations/rentable-cars/edit-registrtion-number";
import { FETCH_RENTABLE_CAR } from "@/graphql/admin/queries/rentable-cars/fetch-rentable-car";
import { AddRentableCarResponse, ChangeActiveStatusResponse, EditRegistrationNumberResponse, FetchRentablecarsResponse, RentableModel } from "@/interfaces/admin/rentable-cars";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { message } from "antd";
import Swal from "sweetalert2";

export class ManageRentablecars{
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
                console.log(data)
                Swal.fire({
                    title: "Error",
                    text: data?.addRentableCar.message,
                    icon: "error",
                    confirmButtonText: "OK",  // Use confirmButtonText instead of 'button'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload()
                    }
                });
            }
        }catch(error){
            console.error(error);
        }
    }

    // change active status of the rentable car
    public changeActiveStatus = async (
        id:number,
        status:boolean
    ):Promise<void> => {
        try{
            const {data} = await this.client.mutate<ChangeActiveStatusResponse>({
                mutation:CHANGE_ACTIVE_STATUS,
                variables:{id,status}
            })

            if(data?.changeActiveStatus.status){
                message.success(data.changeActiveStatus.message);
            }else{
                message.error(data?.changeActiveStatus.message);
            }
        }catch(error){
            console.log(error)
        }
    }

    // edit registration number
    public editRegistrationNumber = async(
        id:number,
        registrationNumber:string
    ):Promise<void> => {
        try{
            const {data} = await this.client.mutate<EditRegistrationNumberResponse>({
                mutation:EDIT_REGISTRTION_NUMBER,
                variables:{
                    id:id,
                    registrationNumber:registrationNumber
                }
            });
            if(data?.editRegistrationNumber.status){
                Swal.fire({
                    title: "Success!",
                    text: data.editRegistrationNumber.message,
                    icon: "success",
                    confirmButtonText: "OK",  // Use confirmButtonText instead of 'button'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload()
                    }
                });
            }else{
                Swal.fire({
                    title: "Error!",
                    text: data?.editRegistrationNumber.message,
                    icon: "error",
                    confirmButtonText: "OK",  // Use confirmButtonText instead of 'button'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload()
                    }
                });
            }
        }catch(error){
            console.log(error)
        }
    }
}