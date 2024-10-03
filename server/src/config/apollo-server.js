import { ApolloServer } from 'apollo-server-express';
import { typeDefs,resolvers } from '../graphql/index.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError:(err)=>{
    console.log("error in formatError");

    if(err){
      console.log(err)
      return {
        message: err.message,
      }
    }
  },
  context: ({ req }) => {
    return { req }; // Add request to the context
  },
});

export const startApolloServer = async (app) => {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' }); // Set your GraphQL endpoint
};
