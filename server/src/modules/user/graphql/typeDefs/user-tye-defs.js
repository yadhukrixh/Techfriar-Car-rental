import { gql } from "apollo-server-express";

const fetchUserTypeDefs = gql`
  type Mutation {
    userLogin(mobileNumber: String!, password: String!): UserLoginResponse
  }

  type UserLoginResponse {
    status: Boolean!
    message: String!
    data: UserData
  }

  type UserData {
    userId: Int!
  }

  type user {
    userId: Int
    profileUrl: String
  }

  type ProfilePicResponse {
    status: Boolean!
    message: String!
    data: user
  }

  type Mutation {
    getProfilePic(userId: Int!): ProfilePicResponse!
  }
`;

export default fetchUserTypeDefs;
