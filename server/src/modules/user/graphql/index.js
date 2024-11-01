import handleCarResolver from "./resolver/car-resolver.js";
import handleOrderResolver from "./resolver/orders-resolver.js";
import registrationResolver from "./resolver/registration-resolver.js";
import handleUserResolvers from "./resolver/user-resolver.js";
import handleCarTypeDefs from "./typeDefs/car-type-def.js";
import handleOrderTypeDefs from "./typeDefs/order-type-def.js";
import registationTypeDefs from "./typeDefs/registration-type-def.js";
import handleUserTypeDefs from "./typeDefs/user-type-defs.js";

const userTypeDefs = [registationTypeDefs,handleUserTypeDefs,handleCarTypeDefs,handleOrderTypeDefs];
const userResolvers = [registrationResolver,handleUserResolvers,handleCarResolver,handleOrderResolver];

export {userTypeDefs,userResolvers};

