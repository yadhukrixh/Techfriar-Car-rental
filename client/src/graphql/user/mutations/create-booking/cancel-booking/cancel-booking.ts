import { gql } from "@apollo/client";

export const CANCEL_BOOKING = gql`
    mutation cancelBooking($bookingId:Int!){
        cancelBooking(bookingId:$bookingId){
            status
            message
        }
    }
`;