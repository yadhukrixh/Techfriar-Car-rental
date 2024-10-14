import { gql } from "@apollo/client";

export const EDIT_REGISTRTION_NUMBER = gql`
    mutation EditRegistrationNumber($id:Int!,$registrationNumber:String!) {
        editRegistrationNumber(
            id:$id
            registrationNumber:$registrationNumber
        ){
            status
            message
        }
    }
`;