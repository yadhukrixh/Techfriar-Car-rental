import handleCarResolver from "./resolver/car-resolver.js";
import registrationResolver from "./resolver/registration-resolver.js";
import handleUserResolvers from "./resolver/user-resolver.js";
import handleCarTypeDefs from "./typeDefs/car-type-def.js";
import registationTypeDefs from "./typeDefs/registration-type-def.js";
import handleUserTypeDefs from "./typeDefs/user-type-defs.js";

const userTypeDefs = [registationTypeDefs,handleUserTypeDefs,handleCarTypeDefs];
const userResolvers = [registrationResolver,handleUserResolvers,handleCarResolver];

export {userTypeDefs,userResolvers};

