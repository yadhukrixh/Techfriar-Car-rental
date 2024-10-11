import { gql } from "@apollo/client";

export const ADD_CAR = gql`
  mutation AddCar(
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
    $pricePerDay: Int
  ) {
    addCar(
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
        pricePerDay: $pricePerDay
      }
    ) {
      status
      message
    }
  }
`;
