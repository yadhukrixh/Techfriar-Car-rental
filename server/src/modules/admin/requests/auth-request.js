import Joi from "joi";

class AuthRequest {
  constructor() {
    // Define the schema in the constructor
    this.schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });
  }

  // Method to validate the email and password (non-static now)
  async ValidateAdmin(email, password) {
    try {
      const { error } = this.schema.validate({ email, password });
      if (error) {
        return {
          status: false,
          message: error.details[0].message,
        };
      }

      // Validation successful
      return {
        status: true,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}

export default AuthRequest;
