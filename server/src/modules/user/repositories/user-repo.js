import Users from "../models/user-model.js";

export class UserRepository {
    //   fetch user by id
    static async fetchUserByID(userId){
        try{
            const user = await Users.findByPk(userId);
            if(!user){
                return{
                    status:false,
                    message:"User hasn't found this in id"
                }
            }

            return{
                status:true,
                message:"User found!",
                data:user.dataValues
            }
        }catch(error){
            console.log(error)
            return{
                status:false,
                message:error
            }
        }
    }
}
