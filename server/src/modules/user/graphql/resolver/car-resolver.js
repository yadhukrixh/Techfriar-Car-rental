import { CarsControllers } from "../../controllers/cars-controllers.js";

const handleCarResolver = {
    Query :{
        fetchAvailableCars: async(_,{startDate,endDate,fuelTypes,transmissionTypes,capacities,maxPrice,sortType,searchQuery}) => {
            try{
                const fetchAvailableCars = await CarsControllers.fetchAvailablecars(startDate,endDate,fuelTypes,transmissionTypes,capacities,maxPrice,sortType,searchQuery);
                return fetchAvailableCars;
                
            }catch(error){
                console.error(error);
                return{
                    status:false,
                    message:error
                }
            }
        },

        //fetch car by id
        fetchCarById:async(_,{id})=>{
            try{
                const car = await CarsControllers.fetchCarById(id);
                return car;
            }catch(error){
                return{
                    status:false,
                    message:"Internal server error"
                }
            }
        }
    },

    Mutation :{
        createBooking: async (_, { input }) => {
            try{
                const bookCar = await CarsControllers.createBooking(input);
                return bookCar;
            }catch(error){
                return{
                    status:false,
                    message:error
                }
            }
        }
    }
}

export default handleCarResolver;