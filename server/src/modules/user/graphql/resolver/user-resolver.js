import { UserController } from "../../controllers/user-controller.js";


const fetchUserResolvers = {
  Mutation: {
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
  },
};

export default fetchUserResolvers;
