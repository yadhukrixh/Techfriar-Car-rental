import { gql } from '@apollo/client';

export const ADD_BRAND = gql`
  mutation AddBrand($name: String!, $country: String, $image: Upload!) {
  addBrand(name: $name, country: $country, image: $image) {
    success
    message
  }
}

`