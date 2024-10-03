import addCarResolver from "./resolver/add-car-resolver.js";
import authResolvers from "./resolver/auth-resolver.js";
import brandResolvers from "./resolver/brand-resolver.js";
import countriesResolvers from "./resolver/countries-resolver.js";
import addCarsTypeDefs from "./type-defs/add-car-type-defs.js";
import authTypeDefs  from "./type-defs/auth-type-defs.js";
import brandTypeDefs from "./type-defs/brand-type-defs.js";
import countriesTypeDefs from "./type-defs/countries-type-defs.js";


const adminTypeDefs = [authTypeDefs,countriesTypeDefs,brandTypeDefs,addCarsTypeDefs];
const adminResolvers = [authResolvers,countriesResolvers,brandResolvers,addCarResolver,];

export { adminTypeDefs,adminResolvers };