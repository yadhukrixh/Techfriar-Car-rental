import { RentableCarsController } from "../../controllers/rentable-cars-controller.js";

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
    }
}

export default rentableCarResolver