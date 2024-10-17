import Users from "../models/user-model.js";

export class RegistrationRepository {
  // Check user already exist
  static async checkUserExist(phoneNumber) {
    try {
      const user = await Users.findOne({ where: { phoneNumber } });
      if (user) {
        return {
          status: true,
          message: "User already exist in this phone number.",
        };
      } else {
        return {
          status: false,
          message: "No user exist in this number.",
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: false,
        message: "Failed to fetch user!",
      };
    }
  }

  // create new user
  static async registerUser(inputData) {
    try {
      const user = await Users.create({
        name: inputData.name,
        email: inputData.email,
        phoneNumber: inputData.phoneNumber,
        password: inputData.password,
        city: inputData.city,
        state: inputData.state,
        country: inputData.country,
        pincode: inputData.pincode,
        phoneNumberVerified:true,
      });

      if(user){
        return{
            status:true,
            message:"User created successfully",
            data:user.id
        }
      }else{
        return{
            status:false,
            message:"Error faced on Register User."
        }
      }
    } catch (error) {
      console.error(error);
      return {
        status: false,
        message: "Database error.",
      };
    }
  }
}
