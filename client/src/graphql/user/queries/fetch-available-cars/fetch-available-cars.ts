import { gql, useQuery } from '@apollo/client';

// Define the GraphQL query
export const FETCH_AVAILABLE_CARS = gql`
  query fetchAvailableCars(
  $startDate: String!,
  $endDate: String!,
  $fuelTypes: [String],
  $transmissionTypes: [String],
  $capacities: [Int],
  $maxPrice: Int,
  $sortType: String,
  $searchQuery: String,
) {
  fetchAvailableCars(
    startDate: $startDate, 
    endDate: $endDate,
    fuelTypes: $fuelTypes,
    transmissionTypes: $transmissionTypes,
    capacities: $capacities,
    maxPrice: $maxPrice,
    sortType: $sortType,
    searchQuery: $searchQuery
  ) {
    status
    message
    data {
      id
      name
      description
      brandName
      brandLogo
      primaryImage
      secondaryImages
      year
      fuelType
      transmissionType
      numberOfSeats
      numberOfDoors
      pricePerDay
    }
  }
}
`;

