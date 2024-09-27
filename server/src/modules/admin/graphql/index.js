import authResolvers from "./resolver/auth-resolver.js";
import brandResolvers from "./resolver/brand-resolver.js";
import countriesResolvers from "./resolver/countries-resolver.js";
import authTypeDefs  from "./type-defs/auth-type-defs.js";
import brandTypeDefs from "./type-defs/brand-type-defs.js";
import countriesTypeDefs from "./type-defs/countries-type-defs.js";


const adminTypeDefs = [authTypeDefs,countriesTypeDefs,brandTypeDefs];
const adminResolvers = [authResolvers,countriesResolvers,brandResolvers];

export { adminTypeDefs,adminResolvers };