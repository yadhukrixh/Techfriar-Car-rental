import { gql } from "@apollo/client";

export const EDIT_CAR = gql`
  mutation editCar(
    $id: Int!,
    $name: String!,
    $description: String!,
    $brandName: String!,
    $primaryImage: UploadOrStringInput!,
    $otherImages: [UploadOrStringInput!]!,
    $availableQuantity: Int!,
    $year: Int!,
    $fuelType: String!,
    $transmissionType: String!,
    $numberOfSeats: Int!,
    $numberOfDoors: Int!
  ) {
    editCar(
      id: $id,
      name: $name,
      description: $description,
      brandName: $brandName,
      primaryImage: $primaryImage,
      otherImages: $otherImages,
      availableQuantity: $availableQuantity,
      year: $year,
      fuelType: $fuelType,
      transmissionType: $transmissionType,
      numberOfSeats: $numberOfSeats,
      numberOfDoors: $numberOfDoors
    ) {
      status
      message
    }
  }
`;
