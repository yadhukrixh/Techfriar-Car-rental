import { gql } from "@apollo/client";

export const ADD_VEHICLE = gql`
  mutation AddVehicle(
    $name: String!
    $description: String!
    $brandId: Int!
    $primaryImage: Upload!
    $additionalImages: [Upload!]!
    $quantity: Int!
    $year: Int
    $fuelType: String
    $transmissionType: String
    $numberOfSeats: Int!
    $numberOfDoors: Int!
  ) {
    addVehicle(
      input: {
        name: $name
        description: $description
        brandId: $brandId
        primaryImage: $primaryImage
        additionalImages: $additionalImages
        quantity: $quantity
        year: $year
        fuelType: $fuelType
        transmissionType: $transmissionType
        numberOfSeats: $numberOfSeats
        numberOfDoors: $numberOfDoors
      }
    ) {
      success
      message
    }
  }
`;
