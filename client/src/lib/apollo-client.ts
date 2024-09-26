import { ApolloClient, InMemoryCache} from '@apollo/client';

const BASE_URL = 'http://localhost:3400';

const client = new ApolloClient({
  uri: `${BASE_URL}/graphql`,
  cache: new InMemoryCache(),
});

export default client;