import { gql } from '@apollo/client';

export const FETCH_USER_DATA = gql`
  query FetchUserData($id: Int!) {
    fetchUserData(id: $id) {
      status
      message
      data {
        name
        email
        phoneNumber
        city
        state
        country
        pincode
        profileImage
      }
    }
  }
`;