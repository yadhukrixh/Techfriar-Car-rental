import authResolvers from "./resolver/auth-resolver.js";
import authTypeDefs  from "./type-defs/auth-type-defs.js";


const adminTypeDefs = authTypeDefs;
const adminResolvers = authResolvers;

export { adminTypeDefs,adminResolvers };