import { gql } from "@apollo/client";

export const BRANDS_QUERY = gql`
    query{
        getBrands{
            success
            message
            data{
                id
                name
                imageUrl
            }
        }
    }
`