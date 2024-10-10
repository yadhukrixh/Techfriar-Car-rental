import { gql } from "@apollo/client";

export const DELETE_CAR = gql`
    mutation deleteCar(
        $id: Int!
    ) {
        deleteCar(id: $id) {
            status
            message
        }
    }
`;