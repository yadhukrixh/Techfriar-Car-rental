import { gql } from "@apollo/client";

export const CREATE_RAZORPAY_ORDER = gql`
  mutation createRazorPayOrder($amount: Int!) {
    createRazorPayOrder(amount: $amount) {
      status
      message
      data {
        orderId
      }
    }
  }
`;
