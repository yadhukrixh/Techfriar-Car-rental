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
        }
    }
}

export default handleCarResolver;