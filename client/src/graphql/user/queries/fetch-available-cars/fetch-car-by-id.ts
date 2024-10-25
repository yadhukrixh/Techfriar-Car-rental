import { gql } from "@apollo/client";

export const FETCH_CAR_BY_ID = gql`
    query fetchCarById($id: Int!) {
        fetchCarById(id: $id) {
            status
            message
            data {
                id
                name
                description
                brandName
                brandLogo
                primaryImage
                secondaryImages
                year
                fuelType
                transmissionType
                numberOfSeats
                numberOfDoors
                pricePerDay
            }
        }
    }
`;
