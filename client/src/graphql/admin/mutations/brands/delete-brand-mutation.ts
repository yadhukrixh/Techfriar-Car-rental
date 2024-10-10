import { gql } from "@apollo/client";

export const DELETE_BRAND = gql`
    mutation deleteBrand(
        $id: Int!
    ) {
        deleteBrand(id: $id) {
            status
            message
        }
    }
`;