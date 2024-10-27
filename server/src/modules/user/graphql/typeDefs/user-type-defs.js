import { gql } from "apollo-server-express";

const handleUserTypeDefs = gql`
  type Mutation {
    userLogin(mobileNumber: String!, password: String!): UserLoginResponse
  }

  type UserLoginResponse {
    status: Boolean!
    message: String!
    data: UserData
  }

  type UserData {
    userId: Int
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

  type UserData {
    id:Int!
    name: String
    email: String
    phoneNumber: String
    city: String
    state: String
    country: String
    pincode: String
    profileImage: String
  }

  type FetchUserDataResponse {
    status: Boolean!
    message: String!
    data: UserData
  }

  type Query {
    fetchUserData(id: Int!): FetchUserDataResponse!
  }

  type UpdateProfilePicResponse {
    status: Boolean!
    message: String!
  }

  type Mutation {
    updateProfilePic(userId: Int!, profileImage: Upload!): UpdateProfilePicResponse!
  }


  type UpdateUserDetailsResponse {
    status: Boolean!
    message: String!
  }

  input UpdateUserDetailsInput {
    name: String
    email: String
    password: String
    city: String
    state: String
    country: String
    pincode: String
  }

  type Mutation {
    updateUserDetails(id: Int!, input: UpdateUserDetailsInput!): UpdateUserDetailsResponse!
  }


`;

export default handleUserTypeDefs;
