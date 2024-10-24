import { UserController } from "../../controllers/user-controller.js";


const handleUserResolvers = {
  Query: {

    // fetch user data
    fetchUserData: async (_, { id }) => {
      try {
        const user = await UserController.fetchUserdata(id);
        return user;
      }catch{
        return{
          status:false,
          message:error
        }
      }
    }

    },
  Mutation: {
    // get profile picture
    getProfilePic: async (_, { userId }) => {
      try {
        const user = await UserController.getProfileUrl(userId);
        return{
            status:user.status,
            message:user.message,
            data:{
                userId:user.data.userId,
                profileUrl:user.data.profileUrl
            }
        }
      } catch (error) {
        console.error(error);
      }
    },

    // user login
    userLogin: async (_, { mobileNumber, password }) => {
      try {
        const login = await UserController.loginUser(mobileNumber,password);
        return{
            status:login.status,
            message:login.message,
            data:{
                userId: login.data, // Ensure this contains the userId
            }
        }
      } catch (error) {
        console.error(error);
        return {
          status: false,
          message: error,
        };
      }
    },

    //update profile picture
    updateProfilePic: async(_, {userId,profileImage}) => {
      try{
        const picUpdate = await UserController.updateProfilePic(userId,profileImage);
        return picUpdate;
      }catch(error){
        console.error(error)
      }
    },

    //update user profile
    updateUserDetails: async(_,{id,input})=>{
      try{
        const updateDetails = await UserController.updateUserdetails(id,input);
        return updateDetails;
      }catch(error){
        console.error(error)
        return{
          status:false,
          message:error
        }
      }
    }
    
  },
};

export default handleUserResolvers;
