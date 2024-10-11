import Joi from "joi";

export class RentableRequest {
  constructor() {
    // Define the schema for registration number validation
    this.registrationNumberSchema = Joi.string()
      .pattern(/^([A-Z]{2})\s*\d{2}\s*([A-Z]{1,2})\s*\d{4}$/)
      .required();
  }

  async validateRegistrationNumber(registrationNumber) {
    try {
      const { error } = this.registrationNumberSchema.validate(registrationNumber);
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
