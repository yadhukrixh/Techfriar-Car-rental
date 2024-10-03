import {gql} from 'apollo-server-express';

const brandTypeDefs = gql`
  scalar Upload

  type AddBrandResponse {
    status:Boolean!
    message:String!
  }

  type Brand {
    id:String!
    name:String!
    imageUrl:String!
    country:String
    numberOfCars:String!
  }

  type GetBrandResponse {
    status:Boolean!
    message:String!
    data:[Brand!]
  }

  type Query {
    getBrands: GetBrandResponse!
  }

  type Mutation {
    addBrand(name: String!, country: String!, image: Upload!): AddBrandResponse!
  }


  type DeleteBrandResponse {
    status: Boolean!
    message: String!
  }

  input deleteBrand {
    id: Int!
  }


  type Mutation {
    deleteBrand(id: Int!): DeleteBrandResponse!
  }

  type UpdateBrandresponse{
    status:Boolean!
    message:String!
  }
  
  type Mutation {
    updateBrand(id: Int!, name:String!, country:String!, image:Upload):UpdateBrandresponse!
  }

`;

export default brandTypeDefs;