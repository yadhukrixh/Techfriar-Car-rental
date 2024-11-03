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
        },

        fetchEachOrder: async(_,{id}) => {
            try{
                const order = await OrdersControllers.fetchEachOrder(id);
                return order;
            }catch(error){
                console.error(error)
            }
        }
    },

    Mutation:{
        downloadExcelByUser: async(_,{id}) => {
            try{
                const downloadExcel = await OrdersControllers.downloadExcelByUser(id);
                return downloadExcel;
            }catch(error){
                console.error(error);
                return{
                    status:false,
                    message:error
                }
            }
        },

        downloadPdfByUser: async(_,{id}) => {
            try{
                const downloadPdf = await OrdersControllers.downloadPdfByUser(id);
                return downloadPdf;
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

export default handleOrderResolver;