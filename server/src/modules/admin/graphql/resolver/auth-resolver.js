
import AuthController from "../../controllers/auth-controller.js";

const authResolvers = {
  Mutation: {
    adminLogin: async (_, { email, password }) => {
      try {
        const response = await AuthController.adminLogin(email,password)
        return {
          success:response.success,
          message:response.message,
          token:response.token
        }
      } catch (error) {
        console.error("Error during admin login:", error);
        return {
          success: false,
          message: "Internal server error",
        };
      }
    },
  },
};

export default authResolvers;
