import { gql } from "@apollo/client";

export const FETCH_RENTABLE_CAR = gql`
  query FetchRentableCars($id: Int!) {
    fetchRentablecars(id: $id) {
      status
      message
      data {
        id
        name
        brandName
        year
        brandLogo
        primaryImage
        availableQuantity
        pricePerDay
        rentableCars {
          id
          registrationNumber
          activeStatus
        }
      }
    }
  }
`;
