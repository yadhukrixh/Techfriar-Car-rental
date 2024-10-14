import { RentableCarsController } from "../../controllers/rentable-cars-controller.js";
import { RentableCarsRepository } from "../../repositories/rentable-cars-repo.js";

const rentableCarResolver = {
    Query: {
        fetchRentablecars: async(_, {id})=>{
            try{
                const car = await RentableCarsController.fetchRentableCars(id);
                return{
                    status:car.status,
                    message:car.message,
                    data:car.data
                }
            }catch(error){
                console.error(error);
                return{
                    status:false,
                    message:"Internam Server error!"
                }
            }
        }
    },

    Mutation: {
        // add new rentable car
        addRentableCar: async(_,{registrationNumber,carId})=>{
            try{
                const addRentableCar = await RentableCarsController.addRentableCar(registrationNumber,carId)
                return{
                    status:addRentableCar.status,
                    message:addRentableCar.message
                }
            }catch(error){
                throw new Error(error)
            }
        },

        // change active status
        changeActiveStatus: async(_,{id,status})=>{
            try{
                const updateStatus = await RentableCarsController.changeActiveStatus(id,status);
                return{
                    status:updateStatus.status,
                    message:updateStatus.message
                }
            }catch(error){
                return{
                    status:false,
                    message:error
                }
            }
        },

        // edit registration number
        editRegistrationNumber: async(_,{id,registrationNumber}) => {
            try{
                const editRegistrationNumber = await RentableCarsController.editRegistrationNumber(id,registrationNumber);
                return{
                    status:editRegistrationNumber.status,
                    message:editRegistrationNumber.message
                }
            }catch(error){
                return{
                    status:false,
                    message:error
                }
            }
        }
    }

}

export default rentableCarResolver