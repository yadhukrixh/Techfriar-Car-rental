import { FormatImageUrl } from "../../../utils/format-image-url.js";
import { RegistrationRepository } from "../repositories/registration-repo.js";
import { UserRepository } from "../repositories/user-repo.js";
import { LoginValidation } from "../requests/login-request.js";
import bcrypt from "bcryptjs";



export class  UserController{


    // login user
    static async loginUser(phoneNumber,password){
        try{
            // validate
            const validationClass = LoginValidation.validateLogin({mobileNumber:phoneNumber,password:password});
            if(!validationClass.status){
                return{
                    status:false,
                    message:validationClass.message
                }
            }

            const user = await RegistrationRepository.checkUserExist(phoneNumber);

            if(!user.status){
                return{
                    status:false,
                    message:user.message
                }
            }

            if(user.data.phoneNumber === phoneNumber){
                const isMatch = await bcrypt.compare(password, user.data.password);
                if(isMatch){
                    return{
                        status:true,
                        message:`Welcome Back ${user.data.name}`,
                        data:user.data.id
                    }
                }else{
                    return{
                        status:false,
                        message:"Password mismatched"
                    }  
                }
            }else{
                return{
                    status:false,
                    message:"Invalid Credential"
                }
            }

        }catch(error){
            console.error(error)
        }
    }

    static async getProfileUrl(userId){
        try{
            const user = await UserRepository.fetchUserByID(userId);
            return{
                status:user.status,
                message:user.message,
                data:{
                    userId:user.data.id,
                    profileUrl:FormatImageUrl.formatUserImageUrl(user.data.profileUrl)
                }
            }
        }catch{
            console.error(error)
        }
    }
}