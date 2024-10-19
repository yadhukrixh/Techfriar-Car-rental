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

    //update profile
    static async updateProfilePic(id,imageUrl) {
        try{
            const user = await Users.findByPk(id);
            const updateImage = await user.update({
                profileUrl:imageUrl
            });
            if(updateImage){
                return{
                    status:true,
                    message:"Successfully uploaded Image"
                }
            }
        }catch(error){
            console.error(error);
            return{
                status:false,
                message:error
            }
        }
    }

    //update userdetails
    static async updateUserDetails(id,input){
        try{
            const user = await Users.findByPk(id);
            const updateUser = await user.update({
                name:input.name,
                email:input.email,
                password:input.password,
                city:input.city,
                state:input.state,
                country:input.country,
                pincode:input.pincode,
            });

            if(!updateUser){
                return{
                    status:false,
                    message:"Failed to update user!"
                }
            }

            return{
                status:true,
                message:"User updated successfully"
            }
        }catch(error){
            return{
                status:false,
                message:error
            }
        }
    }
}
