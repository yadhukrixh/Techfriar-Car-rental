import { ApolloClient, InMemoryCache} from '@apollo/client';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const BASE_URL = 'http://localhost:3400';
const uploadLink = createUploadLink({
  uri: `${BASE_URL}/graphql`,
  credentials:'same-origin',
})

const client = new ApolloClient({
  link: uploadLink,
  uri: `${BASE_URL}/graphql`,
  cache: new InMemoryCache(),
});



export default client;