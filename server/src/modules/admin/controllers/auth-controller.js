import bcrypt from 'bcryptjs';
import AuthRepository from '../repositories/auth-repo';

class AuthController {y
    // function for login
    static async adminLogin(email,password){
        try{
            const admin = AuthRepository.findAdmin(email)
        }catch(error){
            
        }
        
        

    }
}

export default AuthController;