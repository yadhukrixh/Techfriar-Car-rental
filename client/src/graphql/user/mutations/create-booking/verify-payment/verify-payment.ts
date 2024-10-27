import { gql } from "@apollo/client";

export const VERIFY_PAYMENT = gql`
  mutation VerifyPayment($orderId: String!, $paymentId: String!, $signature: String!) {
    verifyPayment(orderId: $orderId, paymentId: $paymentId, signature: $signature) {
      status
      message
    }
  }
`;