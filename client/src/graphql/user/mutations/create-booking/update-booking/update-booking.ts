import { gql } from "@apollo/client";

export const UPDATE_BOOKING = gql`
    mutation updateBooking($bookingId: Int!,$paymentId:String!,verifiedStatus:Boolean!){
        updateBooking(
            bookingId:$bookingId
            paymentId:$paymentId
            verifiedStatus:$verifiedStatus
        ) {
            status
            message
        }
    }
`;