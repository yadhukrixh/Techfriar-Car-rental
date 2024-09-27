import { gql } from '@apollo/client';

export const COUNTRIES_QUERY = gql`
    query {
        getCountries {
            success
            message
            data {
            country
            }
        }
    }
`