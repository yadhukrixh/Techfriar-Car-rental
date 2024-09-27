import {gql} from 'apollo-server-express';

const brandTypeDefs = gql`
  scalar Upload

  type AddBrandResponse {
    succes:Boolean!
    message:String!
  }

  type Query {
    getBrands: [AddBrandResponse!]!
  
  }

  type Mutation {
    addBrand(name: String!, country: String, image: Upload!): AddBrandResponse!
  }
`;

export default brandTypeDefs;