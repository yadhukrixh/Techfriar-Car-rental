const addVehicleResolver = { 
    Mutation:{
        addVehicle: async (_, { modelName, brandId, primaryImage, secondaryImages, quantity }) => {
            try{
                console.log(modelName,brandId,primaryImage,secondaryImages,quantity);
                return{
                    success:true,
                    message:"working properly"
                }
            }catch(error){
                console.error(error);
            }
        }
    }
}

export default addVehicleResolver;