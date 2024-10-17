export interface LoginResponse{
    userLogin:{
        status:boolean;
        message:string;
        data:{
            userId:number;
        }
    }
}