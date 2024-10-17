import { RegistrationController } from "../../controllers/registration-controller.js";

const registrationResolver = {
  Mutation: {
    // send otp
    sendOtp: async (_, { phoneNumber }) => {
      try {
        const sendOtp = await RegistrationController.sendOtp(phoneNumber);
        return {
          status: sendOtp.status,
          message: sendOtp.message,
        };
      } catch (error) {
        return {
          status: false,
          message: error,
        };
      }
    },

    // verify otp
    verifyOtp: async (_, { otp, phoneNumber }) => {
      try {
        const verifyOtp = await RegistrationController.verifyOtp(
          otp,
          phoneNumber
        );
        return {
          status: verifyOtp.status,
          message: verifyOtp.message,
        };
      } catch (error) {
        return {
          status: false,
          message: error,
        };
      }
    },

    // register user
    registerUser: async (_, { input }) => {
      try {
        const registerUser = await RegistrationController.registerUser(input);
        return {
          status: registerUser.status,
          message: registerUser.message,
          data: {
            userId: registerUser.data, // Ensure this contains the userId
          },
        };
      } catch (error) {
        return {
          status: false,
          message: error,
        };
      }
    },
  },
};

export default registrationResolver;
