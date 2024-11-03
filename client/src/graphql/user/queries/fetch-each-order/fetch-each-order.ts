import { gql } from "@apollo/client";

export const FETCH_EACH_ORDER = gql`
    query fetchEachOrder($id:Int!){
        fetchEachOrder(id:$id){
            status
            message
            data{
                userData{
                    id
                    name
                    email
                    phoneNumber
                    city
                    state
                    country
                    pincode
                    otp
                }
                orderData{
                    id
                    orderedDate
                    bookedDates
                    carName
                    carImage
                    carYear
                    brandName
                    paymentId
                    method
                    status
                    orderStatus
                    amount
                }
            }
        }
    }
`;