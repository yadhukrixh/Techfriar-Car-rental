import Joi from "joi";

class UserRequest {
  constructor() {
    // Define the Joi validation schema for user registration
    this.registerUserSchema = Joi.object({
      name: Joi.string().min(2).max(50).required().messages({
        'string.base': 'Name should be a text',
        'string.empty': 'Name cannot be empty',
        'string.min': 'Name should have at least 2 characters',
        'string.max': 'Name should have less than 50 characters',
        'any.required': 'Name is a required field',
      }),

      email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email',
        'any.required': 'Email is required',
      }),

      phoneNumber: Joi.string()
        .pattern(/^[0-9]+$/)
        .length(10)
        .required()
        .messages({
          'string.base': 'Phone number should be a string',
          'string.empty': 'Phone number cannot be empty',
          'string.pattern.base': 'Phone number must contain only digits',
          'string.length': 'Phone number must be exactly 10 digits',
          'any.required': 'Phone number is required',
        }),

      password: Joi.string().min(8).max(30).required().messages({
        'string.min': 'Password should have at least 8 characters',
        'string.max': 'Password should have less than 30 characters',
        'any.required': 'Password is required',
      }),

      city: Joi.string().allow(null, '').optional().messages({
        'string.base': 'City should be a string',
      }),

      state: Joi.string().allow(null, '').optional().messages({
        'string.base': 'State should be a string',
      }),

      country: Joi.string().allow(null, '').optional().messages({
        'string.base': 'Country should be a string',
      }),

      pincode: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(5)
        .max(10)
        .optional()
        .allow(null, '')
        .messages({
          'string.base': 'Pincode should be a string of digits',
          'string.pattern.base': 'Pincode must contain only digits',
          'string.min': 'Pincode should have at least 5 digits',
          'string.max': 'Pincode should have less than 10 digits',
        }),
    });
  }

  // Method to validate user input
  async validateUserInput(input) {
    try {
      const { error } = this.registerUserSchema.validate(input);

      if (error) {
        return {
          status: false,
          message: error.details[0].message,
        };
      }

      // If validation succeeds
      return {
        status: true,
      };
    } catch (err) {
      console.error("Validation error:", err);
      throw new Error('Validation failed');
    }
  }
}

export default UserRequest;
