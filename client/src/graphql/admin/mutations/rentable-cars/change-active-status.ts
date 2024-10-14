import { gql } from "@apollo/client";

export const CHANGE_ACTIVE_STATUS = gql`
    mutation ChangeActiveStatus(
        $id:Int!
        $status:Boolean!
    ) {
        changeActiveStatus(
            id: $id
            status: $status
        ){
            status
            message
        }
    }
`;