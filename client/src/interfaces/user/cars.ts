export interface FetchedCarData {
    id: number;
    name: string;
    description: string;
    brandName: string;
    brandLogo: string;
    primaryImage: string;
    secondaryImages: string[];
    year: number;
    fuelType: string;
    transmissionType: string;
    numberOfSeats: number;
    numberOfDoors: number;
    pricePerDay: number;
}

// car list compoonent props
export interface CarRentalListComponentProps{
    carList:FetchedCarData[] | null;
    onclickFunction:(id:number)=>void;
}


// car filteration props
export interface FilterationComponentProps {
    setMaxPrice: (data: number) => void;
    setFuelType: (data: string[]) => void;
    setTransmission: (data: string[]) => void;
    setCapacities: (data: number[]) => void;
    setSortingType: (data: string) => void;
    selectedDates: string[]; // Changed to string[] to handle date range
    setSelectedDates: (dates: string[]) => void; // Changed to accept string[]
}


// Interface for the entire response
export interface FetchAvailableCarsResponse {
    fetchAvailableCars:{
        status: boolean;
        message: string;
        data: FetchedCarData[] | null; // Nullable in case no cars are available
    }
}


// interface for the fetch cars by id
export interface FetchCarByIdResponse {
    fetchCarById:{
        status:boolean;
        message:string;
        data:FetchedCarData;
    }
}

//ccreate booking
export interface CreateBookingResponse{
    createBooking:{
        status:boolean;
        message:string;
        data:{
            bookingId:number;
        }
    }
}

//create razorpay order
export interface CreateRazorPayOrderResponse{
    createRazorPayOrder:{
        status:boolean;
        message:string;
        data:{
            orderId:string;
        }
    }
}

//verify payment response
export interface VerifyPaymentResponse{
    verifyPayment:{
        status:boolean;
        message:string;
    }
}

//update booking resoponse
export interface UpdateBookingResponse{
    updateBooking:{
        status:boolean;
        message:string;
    }
}

