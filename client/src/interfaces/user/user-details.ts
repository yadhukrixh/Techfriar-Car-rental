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



export interface OrderDetails { 
    id:number;
    orderedDate:string;
    bookedDates:[string];
    carName:string;
    carImage:string;
    carYear:string;
    brandName:string;
    paymentId:string;
    method:string;
    status:string;
    orderStatus:string;
    amount:number;
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
    fetchAllOrdersOfUser:{
        status:boolean;
        message:string;
        data:OrderData[];
    }
}

export interface DownloadExcelResponse{
    downloadExcelByUser:{
        status:boolean;
        message:string;
        data:{
            downloadUrl:string;
        }
    }
}


export interface FetchEachOrderResponse{
    fetchEachOrder:{
        status:boolean;
        message:string;
        data:{
            userData:UserData;
            orderData:OrderDetails;
        }
    }
}

export interface DownloadPdfResponse{
    downloadPdfByUser:{
        status:boolean;
        message:string;
        data:{
            downloadUrl:string;
        }
    }
}

