// Single car detail for fetching Add rentables

export interface RentableCar {
    id: number;
    registrationNumber: string;
    activeStatus: boolean;
}

export interface RentableModel {
    id: number;
    name: string;
    brandName: string;
    year: number;
    brandLogo: string;
    primaryImage: string;
    availableQuantity: number;
    pricePerDay: number;
    rentableCars: RentableCar[]; // Use RentableCar[] for array of rentable cars
}

export interface FetchRentablecarsResponse {
    fetchRentablecars:{
        status: boolean;
        message: string;
        data: RentableModel;
    }
}

export interface AddRentableCarResponse{
    addRentableCar:{
        status:boolean;
        message:string;
    }
}

export interface ChangeActiveStatusResponse{
    changeActiveStatus:{
        status:boolean;
        message:string;
    }
}

export interface EditRegistrationNumberResponse{
    editRegistrationNumber:{
        status:boolean;
        message:string;
    }
}
