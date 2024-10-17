// send otp response
export interface SendOtpResponse{
    sendOtp:{
        status:boolean;
        message:string;
    }
}

// verify otp response
export interface VerifyOtpResponse{
    verifyOtp:{
        status:boolean;
        message:string;
        data:{
            userId:number;
        }
    }
}

// register user responses
export interface RegisterUserResponse{
    registerUser:{
        status:boolean;
        message:string;
        data:{
            userId:number;
        }
    }
}