import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import AuthRepository from "../repositories/auth-repo.js";
import dotenv from "dotenv";
dotenv.config();

class AuthController {
  // function for login
  static async adminLogin(email, password) {
    try {
      const admin = await AuthRepository.findAdmin(email);
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return {
          success: false,
          message: "Invalid credentials",
        };
      }

      const token = jwt.sign(
        { id: admin.id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return {
        success: true,
        message: "Login successful",
        token,
      };
    } catch (error) {
      return{
        success:false,
        message:"User Not found"
      }
    }
  }
}

export default AuthController;
