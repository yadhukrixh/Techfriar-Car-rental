import registrationResolver from "./resolver/registration-resolver.js";
import registationTypeDefs from "./typeDefs/registration-type-def.js";

const userTypeDefs = registationTypeDefs;
const userResolvers = registrationResolver;

export {userTypeDefs,userResolvers};

