import { gql } from "@apollo/client";

export const BRANDS_QUERY = gql`
    query{
        getBrands{
            status
            message
            data{
                id
                name
                imageUrl
                country
                numberOfCars
            }
        }
    }
`
