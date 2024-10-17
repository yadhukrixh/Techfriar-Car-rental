import { gql } from '@apollo/client';

export const LOGIN_MUTATION= gql`
    mutation UserLogin(
        $mobileNumber: String!
        $password: String!
    ) {
    userLogin(
        mobileNumber: $mobileNumber
        password: $password
    ) {
      status
      message
      data{
        userId
      }
    }
  }
`