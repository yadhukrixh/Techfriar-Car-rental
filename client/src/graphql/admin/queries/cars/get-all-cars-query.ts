import { gql } from "@apollo/client";

export const GET_ALL_CARS_QUERY = gql`
    query{
        getAllCars{
            status
            message
            data{
                id
                name
                description
                brandName
                year
                brandLogo
                primaryImage
                otherImages
                availableQuantity
                fuelType
                transmissionType
                numberOfSeats
                numberOfDoors
            }
        }
    }
`
