import { gql } from '@apollo/client';

// GraphQL mutation for updating user details
export const UPDATE_USER_DETAILS_MUTATION = gql`
  mutation UpdateUserDetails(
    $id: Int!
    $name: String
    $email: String
    $password: String
    $city: String
    $state: String
    $country: String
    $pincode: String
  ) {
    updateUserDetails(
      id: $id
      input: {
        name: $name
        email: $email
        password: $password
        city: $city
        state: $state
        country: $country
        pincode: $pincode
      }
    ) {
      status
      message
    }
  }
`;
