import { OrdersControllers } from "../../controllers/orders-controllers.js";

const handleOrderResolver = {
    Query:{
        fetchAllOrdersOfUser: async(_,{id,timePeriod,searchQuery,orderStatus}) => {
            try{
                const orders = await OrdersControllers.fetchAllOrdersOfUser(id,timePeriod,searchQuery,orderStatus);
                return orders;
            }catch(error){
                console.error(error);
                return{
                    status:false,
                    message:error,
                }
            }
        }
    }
}

export default handleOrderResolver;