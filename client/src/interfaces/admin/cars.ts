export interface CarsProps{
    id?:number;
    model:string;
    year:string
    seats:number;
    fuel:string;
    transmission:string;
    price:string;
    image:string;
}

// Interface for the Car data
export interface CarData{
    id:number;
    name:string;
    description:string;
    year:number,
    brandName:string;
    brandLogo:string;
    primaryImage:string;
    otherImages:[string];
    availableQuantity:number;
    fuelType:string;
    transmissionType:string;
    numberOfSeats:number;
    numberOfDoors:number;
    pricePerDay: number;
}

// Interface for the query
export interface GetAllCarsResponse{
    getAllCars:{
        status:boolean;
        message:string;
        data:[CarData];
    }
}

// interface for the delete car
export interface DeleteCarResponse{
    deleteCar:{
        status:boolean;
        message:string;
    }
}

// Interface for the edit car
export interface EditCarResponse{
    editCar:{
        status:boolean;
        message:string;
    }
}