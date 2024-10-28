import { gql } from "apollo-server-express";

const handleCarTypeDefs = gql`
  type Query {
    fetchAvailableCars(
      startDate: String!
      endDate: String!
      fuelTypes: [String]
      transmissionTypes: [String]
      capacities: [Int]
      maxPrice: Int
      sortType: String
      searchQuery: String
    ): FetchAvailableCarsResponse!
  }

  type FetchAvailableCarsResponse {
    status: Boolean!
    message: String!
    data: [CarData]!
  }

  type CarData {
    id: Int!
    name: String!
    description: String!
    brandName: String!
    brandLogo: String!
    primaryImage: String!
    secondaryImages: [String]!
    year: Int!
    fuelType: String!
    transmissionType: String!
    numberOfSeats: Int!
    numberOfDoors: Int!
    pricePerDay: Int!
  }

  type Query {
    fetchCarById(id: Int!): FetchCarByIdResponse!
  }

  type FetchCarByIdResponse {
    status: Boolean!
    message: String!
    data: CarData
  }

  input CreateBookingInput {
    userId: Int!
    bookedDates: [String!]!
    carModelId: Int!
    deliveryLocation: String!
    returnLocation: String!
    secondaryMobileNumber: String!
    amount: Float!
  }

  type BookingResponse {
    status: Boolean!
    message: String!
    data: BookingData
  }

  type BookingData {
    orderId: Int!
  }

  type Mutation {
    createBooking(input: CreateBookingInput!): BookingResponse!

    createRazorPayOrder(amount: Int!): OrderResponse!

    verifyPayment(
      orderId: String!
      paymentId: String!
      signature: String!
    ): DefaultResponse!

    updateBooking(bookingId:Int!,paymentId:String!,verifiedStatus:Boolean!):DefaultResponse!

    cancelBooking(bookingId:Int!):DefaultResponse!
  }

  type OrderResponse {
    status: Boolean!
    message: String!
    data: Order
  }

  type Order {
    orderId: String
  }

  type DefaultResponse {
    status: Boolean!
    message: String
  }
`;

export default handleCarTypeDefs;
