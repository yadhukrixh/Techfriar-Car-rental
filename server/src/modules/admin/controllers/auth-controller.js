import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthRepository from "../repositories/auth-repo.js";
import dotenv from "dotenv";
import AuthRequest from "../requests/auth-request.js";
dotenv.config();

class AuthController {
  // function for login
  static async adminLogin(email, password) {
    try {
      const authRequest = new AuthRequest(); // Create an instance

      const validation = await authRequest.ValidateAdmin(email, password); // Call non-static method
      
      if (validation.status) {
        const admin = await AuthRepository.findAdmin(email);
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
          return {
            status: false,
            message: "Invalid credentials",
          };
        }

        const token = jwt.sign(
          { id: admin.id, role: admin.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return {
          status: true,
          message: "Login statusful",
          token,
        };
      }
    } catch (error) {
      return {
        status: false,
        message: "User Not found",
      };
    }
  }
}

export default AuthController;
