// validation.js
import Joi from 'joi';

export class LoginValidation {
    // Function to validate phone number and password
    static validateLogin(data) {
        const schema = Joi.object({
            mobileNumber: Joi.string()
                .pattern(/^[0-9]{10}$/) // Validates a 10-digit phone number
                .required()
                .messages({
                    'string.empty': 'Mobile number is required.',
                    'string.pattern.base': 'Mobile number must be a 10-digit number.',
                }),
            password: Joi.string()
                .min(6) // Minimum length of password
                .max(30) // Maximum length of password
                .required()
                .messages({
                    'string.empty': 'Password is required.',
                    'string.min': 'Password must be at least 6 characters long.',
                    'string.max': 'Password must be at most 30 characters long.',
                }),
        });

        const { error, value } = schema.validate(data, { abortEarly: false }); // Validate and return errors if any

        if (error) {
            // If there are validation errors, return status and messages
            return {
                status: false,
                message: error.details.map(err => err.message).join(', '),
            };
        }

        // If validation is successful, return status and validated data
        return {
            status: true,
            message: 'Validation successful.',
            data: value,
        };
    }
}


