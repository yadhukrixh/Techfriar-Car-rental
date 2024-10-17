import { gql } from "@apollo/client";

export const VERIFY_OTP = gql `
    mutation VerifyOtp($otp: String!,$phoneNumber:String!){
        verifyOtp(
            otp: $otp
            phoneNumber: $phoneNumber
        ){
            status
            message
        }
    }
`;