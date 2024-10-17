import { gql } from "@apollo/client";

export const SEND_OTP = gql `
    mutation SendOtp($phoneNumber: String!){
        sendOtp(phoneNumber: $phoneNumber){
            status
            message
        }
    }
`;