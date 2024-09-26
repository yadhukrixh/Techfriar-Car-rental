import Admins from "../models/admin-models.js";

class AuthRepository {

    // function to find admin by email
    static async findAdmin(email){
        try{
            const admin = await Admins.findOne({where:{email}});
            if(!admin){
                throw new Error("Admin not found");
            }
            return admin;
        }catch(error){
            return{
                message:"user not found"
            }
        }
    }
}

export default AuthRepository;