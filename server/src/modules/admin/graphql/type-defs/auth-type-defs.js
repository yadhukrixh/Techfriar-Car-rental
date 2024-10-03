import { gql } from 'apollo-server-express';

const authTypeDefs = gql`
  type Admin {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type LoginResponse {
    status: Boolean!
    message: String!
    token: String
  }

  input AdminLoginInput {
    email: String!
    password: String!
  }

  type Query {
    getAdmin(id: ID!): Admin
  }

  type Mutation {
    adminLogin(email: String!, password: String!): LoginResponse!
  }
`;


export default authTypeDefs;