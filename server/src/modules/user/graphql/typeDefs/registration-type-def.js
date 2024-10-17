import { gql } from "apollo-server-express";

const registationTypeDefs = gql`
  type Mutation {
    sendOtp(phoneNumber: String!): SendOtpResponse!
  }

  type SendOtpResponse {
    status: Boolean!
    message: String!
  }

  type Mutation {
    verifyOtp(otp: String!, phoneNumber: String!): VerifyOtpResponse!
  }

  type VerifyOtpResponse {
    status: Boolean!
    message: String!
  }

  input RegisterUserInput {
    name: String!
    email: String!
    phoneNumber: String!
    password: String!
    city: String
    state: String
    country: String
    pincode: String
  }

  type UserId {
    userId: Int
  }

  type RegisterUserResponse {
    status: Boolean!
    message: String!
    data: UserId
  }

  type Mutation {
    registerUser(input: RegisterUserInput!): RegisterUserResponse!
  }
`;

export default registationTypeDefs;
