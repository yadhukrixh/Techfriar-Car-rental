import { message } from "antd";
import { OrderData } from "./orders";

export interface UserData {
    id?:number;
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
    profileImage?:string;
    newImage?:File;
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



export interface FetchUserDataResponse{
    fetchUserData:{
        status:boolean;
        message:string;
        data:UserData
    }
}

export interface UpdateProfilePictureResponse{
    updateProfilePic:{
        status:boolean;
        message:string;
    }
}

export interface UpdateUSerDetailsResponse{
    updateUserDetails:{
        status:boolean;
        message:string;
    }
}

export interface FetchOrdersResponse{
    fetchAllOrderOfUser:{
        status:boolean;
        message:string;
        data:OrderData[];
    }
}