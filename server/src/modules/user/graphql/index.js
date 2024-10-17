import registrationResolver from "./resolver/registration-resolver.js";
import fetchUserResolvers from "./resolver/user-resolver.js";
import registationTypeDefs from "./typeDefs/registration-type-def.js";
import fetchUserTypeDefs from "./typeDefs/user-tye-defs.js";

const userTypeDefs = [registationTypeDefs,fetchUserTypeDefs];
const userResolvers = [registrationResolver,fetchUserResolvers];

export {userTypeDefs,userResolvers};

