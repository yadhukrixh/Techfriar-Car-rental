import {gql} from 'apollo-server-express';

const brandTypeDefs = gql`
  scalar Upload

  type AddBrandResponse {
    success:Boolean!
    message:String!
  }

  type Brand {
    id:String!
    name:String!
    imageUrl:String!
  }

  type GetBrandResponse {
    success:Boolean!
    message:String!
    data:[Brand!]
  }

  type Query {
    getBrands: GetBrandResponse!
  }

  type Mutation {
    addBrand(name: String!, country: String, image: Upload!): AddBrandResponse!
  }
`;

export default brandTypeDefs;