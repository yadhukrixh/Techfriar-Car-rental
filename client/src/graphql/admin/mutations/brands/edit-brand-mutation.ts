import { gql } from "@apollo/client";

export const UPDATE_BRAND = gql`
    mutation updateBrand(
        $id: Int!, $name:String!, $country:String!, $image:Upload) {
        updateBrand(id: $id, name:$name, country:$country, image:$image) {
            status
            message
        }
    }
`;