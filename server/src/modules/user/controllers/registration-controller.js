import { sendOtpSms, verifyOtpApi } from "../config/otp.js";
import { RegistrationRepository } from "../repositories/registration-repo.js";
import UserRequest from "../requests/registration-request.js";
import bcrypt from "bcryptjs";

export class RegistrationController {
  // send otp function
  static async sendOtp(phoneNumber) {
    try {
        // check user
      const userExist = await RegistrationRepository.checkUserExist(
        phoneNumber
      );
      if (userExist.status) {
        return {
          status: false,
          message: userExist.message,
        };
      }
      const sendOtp = sendOtpSms(`+91${phoneNumber}`);
      return {
        status: (await sendOtp).status,
        message: (await sendOtp).message,
      };
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  }

  // verify otp
  static async verifyOtp(otp, phoneNumber) {
    try {
      const verifyOtp = verifyOtpApi(`+91${phoneNumber}`, otp);
      return {
        status: (await verifyOtp).status,
        message: (await verifyOtp).message,
      };
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  }

  // Register user
  static async registerUser(input) {
    const userRequest = new UserRequest();
    try {
      const validateUserData = await userRequest.validateUserInput(input);
      if (!validateUserData.status) {
        return {
          status: false,
          message: validateUserData.message,
        };
      }

      // check user
      const userExist = await RegistrationRepository.checkUserExist(
        input.phoneNumber
      );
      if (userExist.status) {
        return {
          status: false,
          message: userExist.message,
        };
      }

      // hash password
      const hashedPassword = await bcrypt.hash(input.password, 10); // Use input.password
      const inputData = {
        ...input, // Spread the original input fields
        password: hashedPassword, // Overwrite the password field with the hashed one
      };

      const newUser = await RegistrationRepository.registerUser(inputData);
      if(newUser){
        return{
            status:newUser.status,
            message:newUser.message,
            data:newUser.data
        }
      }

    } catch (error) {
      console.error(error);
      return {
        status: false,
        message: error,
      };
    }
  }
}
