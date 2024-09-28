import { gql } from '@apollo/client';

export const ADD_BRAND = gql`
  mutation addBrand($name: String!, $country: String, $image: Upload!) {
  addBrand(name: $name, country: $country, image: $image) {
    success
    message
  }
}
`