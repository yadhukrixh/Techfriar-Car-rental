import { RentableCarsRepository } from "../repositories/rentable-cars-repo.js";
import { RentableRequest } from "../requests/add-rentables-request.js";

export class RentableCarsController{
    // fetch rentable cars on a single model
    static async fetchRentableCars(id){
        try{
            const car = await RentableCarsRepository.fetchRentableCars(id)
            return{
                status:car.status,
                message:car.message,
                data:car.data
            }
        }catch(error){
            console.error(error);
            return{
                status:false,
                message:"failed to fetch rentable cars"
            }
        }
    }

    // add rentable car to the database
    static async addRentableCar(registrationNumber,carId){
        try{
            const rentableRequest = new RentableRequest();

            const validateRegistration = await rentableRequest.validateRegistrationNumber(registrationNumber);
            if(!(validateRegistration.status)){
                return{
                    status:false,
                    message:`Error in request Validation ${validateRegistration.message}`
                }
            }

            const rentableExist = await RentableCarsRepository.checkRentableAlreadyExist(registrationNumber);

            if(rentableExist.status){
                return{
                    status:false,
                    message:rentableExist.message
                }
            }

            const addRentableCar = await RentableCarsRepository.addRentableCar(registrationNumber,carId);

            return{
                status:addRentableCar.status,
                message:addRentableCar.message
            }
        }catch(error){
            throw error;
        }
    }

    
}