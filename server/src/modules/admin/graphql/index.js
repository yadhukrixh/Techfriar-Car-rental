import allCarsResolver from "./resolver/all-cars-resolver.js";
import authResolvers from "./resolver/auth-resolver.js";
import brandResolvers from "./resolver/brand-resolver.js";
import countriesResolvers from "./resolver/countries-resolver.js";
import rentableCarResolver from "./resolver/rentable-cars-resolver.js";
import allCarsTypeDefs from "./type-defs/all-cars-type-defs.js";
import authTypeDefs  from "./type-defs/auth-type-defs.js";
import brandTypeDefs from "./type-defs/brand-type-defs.js";
import countriesTypeDefs from "./type-defs/countries-type-defs.js";
import rentableCarsTypeDefs from "./type-defs/rentable-cars-type-defs.js";


const adminTypeDefs = [authTypeDefs,countriesTypeDefs,brandTypeDefs,allCarsTypeDefs,rentableCarsTypeDefs];
const adminResolvers = [authResolvers,countriesResolvers,brandResolvers,allCarsResolver,rentableCarResolver];

export { adminTypeDefs,adminResolvers };