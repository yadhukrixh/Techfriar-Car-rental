import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import AuthRepository from '../../repositories/auth-repo.js';

dotenv.config();
const  authResolvers = {
  Mutation: {
    adminLogin: async (_, { email, password }) => {
      console.log(email,password)
      try {
        
        const admin = await AuthRepository.findAdmin(email)

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
          return {
            success: false,
            message: 'Invalid credentials',
          };
        }

        const token = jwt.sign(
          { id: admin.id, role: admin.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return {
          success: true,
          message: 'Login successful',
          token,
        };
      } catch (error) {
        console.error('Error during admin login:', error);
        return {
          success: false,
          message: 'Internal server error',
        };
      }
    },
  },
};

export default authResolvers;