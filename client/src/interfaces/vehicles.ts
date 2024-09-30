interface Brand{
    id:string;
    name:string;
    imageUrl:string;
}

export interface GetBrandsResponse{
    getBrands:{
        success:boolean;
        message:string;
        data:Brand[];
    }
}

export interface AddVehicleResponse {
    addVehicle:{
        success:boolean;
        mesage:string;
    }
}