import { gql } from '@apollo/client';

export const ADMIN_LOGIN_MUTATION = gql`
  mutation adminLogin($email: String!, $password: String!) {
    adminLogin(email: $email, password: $password) {
      status
      message
      token
    }
  }
`;