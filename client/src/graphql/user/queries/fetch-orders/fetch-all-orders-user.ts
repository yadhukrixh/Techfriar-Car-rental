import { gql } from "@apollo/client";

export const FETCH_ALL_ORDERS_USER = gql`
    query fetchAllOrdersOfUser($id:Int!,$timePeriod:String,$searchQuery:String,$orderStatus:String){
        fetchAllOrdersOfUser(
            id:$id
            timePeriod:$timePeriod
            searchQuery:$searchQuery
            orderStatus:$orderStatus
        ){
            status
            message
            data{
                orderId
                carName
                image
                registrationNumber
                brandName
                completionStatus
                orderStatus
                orderDate
                bookedDates
            }
        }
    }
`;