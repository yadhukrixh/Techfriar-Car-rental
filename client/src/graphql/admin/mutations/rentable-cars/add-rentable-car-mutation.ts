import { gql } from "@apollo/client";

export const ADD_RENTABLE_CAR = gql `
    mutation AddRentablecar(
        $registrationNumber: String!
        $carId: Int!
    ) {
        addRentableCar(
            registrationNumber: $registrationNumber
            carId: $carId
        ){
            status
            message
        }
    }
`