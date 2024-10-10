// Single car detail for fetching Add rentables

interface RentableCar {
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
    rentableCars: RentableCar[]; // Use RentableCar[] for array of rentable cars
}

export interface FetchRentablecarsResponse {
    fetchRentableCars: {
        status: boolean;
        message: string;
        data: RentableModel;
    };
}
