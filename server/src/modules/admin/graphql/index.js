import addVehicleResolver from "./resolver/add-vehicle-resolver.js";
import authResolvers from "./resolver/auth-resolver.js";
import brandResolvers from "./resolver/brand-resolver.js";
import countriesResolvers from "./resolver/countries-resolver.js";
import addVehiclesTypeDefs from "./type-defs/add-vehicle-type-defs.js";
import authTypeDefs  from "./type-defs/auth-type-defs.js";
import brandTypeDefs from "./type-defs/brand-type-defs.js";
import countriesTypeDefs from "./type-defs/countries-type-defs.js";


const adminTypeDefs = [authTypeDefs,countriesTypeDefs,brandTypeDefs,addVehiclesTypeDefs];
const adminResolvers = [authResolvers,countriesResolvers,brandResolvers,addVehicleResolver];

export { adminTypeDefs,adminResolvers };