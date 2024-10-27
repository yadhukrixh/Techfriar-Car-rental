import { gql } from "@apollo/client";

export const CREATE_BOOKING = gql`
  mutation createBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      status
      message
      data {
        orderId
      }
    }
  }
`;
