import { gql } from "apollo-server-express";

const handleOrderTypeDefs = gql`
  type Query {
    fetchAllOrdersOfUser(
      id: Int!
      timePeriod: String
      searchQuery: String
      orderStatus: String
    ): OrdersResponse!
    fetchEachOrder(id: Int!): FetchEachOrderResponse!
  }

  type OrdersResponse {
    status: Boolean!
    message: String!
    data: [OrderData]
  }

  type OrderData {
    orderId: Int!
    carName: String!
    image: String!
    registrationNumber: String!
    brandName: String!
    completionStatus: String!
    orderStatus: String!
    orderDate: String!
    bookedDates: [String]
  }

  type Mutation {
    downloadExcelByUser(id: Int!): DownloadResponse!
    downloadPdfByUser(id: Int!): DownloadResponse!
  }

  type DownloadResponse {
    status: Boolean!
    message: String!
    data: DownloadUrl
  }

  type DownloadUrl {
    downloadUrl: String
  }

  type FetchEachOrderResponse {
    status: String!
    message: String!
    data: OrderDataPayload
  }

  type OrderDataPayload {
    userData: UserData
    orderData: OrderDetailedData
  }

  type UserData {
    id: Int!
    name: String!
    email: String!
    phoneNumber: String
    city: String
    state: String
    country: String
    pincode: String
    otp: String
  }

  type OrderDetailedData {
    id: Int!
    orderedDate: String!
    bookedDates: [String!]!
    carName: String!
    carImage: String
    carYear: Int
    brandName: String!
    paymentId: String
    method: String
    status: String!
    orderStatus: String!
    amount: Float!
  }
`;

export default handleOrderTypeDefs;
