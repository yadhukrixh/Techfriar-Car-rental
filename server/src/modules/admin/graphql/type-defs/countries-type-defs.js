import { gql } from 'apollo-server-express';

const countriesTypeDefs = gql`
  scalar Upload

  type Country {
    country: String!
  }

  type CountriesResponse {
    success: Boolean!
    message: String!
    data: [Country]!
  }

  type Query {
    getCountries: CountriesResponse!
  }
`;

export default countriesTypeDefs;