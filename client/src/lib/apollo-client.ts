import { ApolloClient, InMemoryCache} from '@apollo/client';
import {createUploadLink} from "apollo-upload-client";

const BASE_URL = 'http://localhost:3400';

const client = new ApolloClient({
  link: createUploadLink({
    uri: `${BASE_URL}/graphql`,
  }),
  cache: new InMemoryCache(),
});



export default client;