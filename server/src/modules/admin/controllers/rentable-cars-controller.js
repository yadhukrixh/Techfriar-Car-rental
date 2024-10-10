import { RentableCarsRepository } from "../repositories/rentable-cars-repo.js";

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

    
}