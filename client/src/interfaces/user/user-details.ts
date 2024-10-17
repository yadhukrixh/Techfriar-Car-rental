import { message } from "antd";

export interface UserData {
    name?: string;
    email?: string;
    phoneNumber?: string; // Change to string
    password?: string;
    confirmPassword?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string; // Change to string
    otp?:string;
}

export interface UserProfilePic{
    profileUrl:string,
    userId:number;
}

export interface FetchProfilePicResponse{
    getProfilePic:{
        status:boolean;
        message:string;
        data:UserProfilePic;
    }
}
