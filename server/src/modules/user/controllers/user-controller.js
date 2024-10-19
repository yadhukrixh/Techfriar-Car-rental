import { FormatImageUrl } from "../../../utils/format-image-url.js";
import { MinioUtils } from "../../../utils/minio-functions.js";
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

    // get user profile pic
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

    // fetch user data
    static async fetchUserdata(id){
        try{
            const userData = await UserRepository.fetchUserByID(id);
            if(!userData.status){
                return{
                    status:false,
                    message:"Failed to fetch user data"
                }
            }

            const formattedUser = {
                name:userData.data.name,
                email:userData.data.email,
                phoneNumber:userData.data.phoneNumber,
                city:userData.data.city,
                state:userData.data.state,
                country:userData.data.country,
                pincode:userData.data.pincode,
                profileImage:FormatImageUrl.formatUserImageUrl(userData.data.profileUrl)
            }

            return{
                status:true,
                message:"User found",
                data:formattedUser
            }
        }catch(error){
            console.error(error);
            return{
                status:false,
                message:error
            }
        }
    }

    // update user pic
    static async updateProfilePic(id,profileImage){
        try{
            const user = await UserRepository.fetchUserByID(id);
            if(user.status){
                if(!(user.data.profileUrl === "default/user.svg")){
                    const deleteImage = await MinioUtils.deleteFileFromMinio(user.data.profileUrl,"user");
                }
                const newImageUrl = await MinioUtils.uploadFileToMinio(profileImage,user.data.phoneNumber,"user");
                const updateImage = await UserRepository.updateProfilePic(id,newImageUrl);
                return updateImage;
            }
        }catch(error){
            console.error(error);
            return{
                status:false,
                message:error
            }
        }
    }
    
    //update user details
    static async updateUserdetails(id,input){
        try{
            console.log(input.password)
            const hashedPassword = await bcrypt.hash(input.password, 10); // Use input.password
            const inputData = {
                ...input, // Spread the original input fields
                password: hashedPassword, // Overwrite the password field with the hashed one
              };
            const updateUser = await UserRepository.updateUserDetails(id,inputData);
            return updateUser;
        }catch(error){
            console.error(error);
            return{
                statusfalse,
                message:error
            }
        }
    }
}