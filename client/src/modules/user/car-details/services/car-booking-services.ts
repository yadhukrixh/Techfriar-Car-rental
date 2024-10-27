import { CREATE_BOOKING } from "@/graphql/user/mutations/create-booking/create-booking";
import { FETCH_CAR_BY_ID } from "@/graphql/user/queries/fetch-available-cars/fetch-car-by-id";
import { CreateBookingResponse, FetchCarByIdResponse, FetchedCarData } from "@/interfaces/user/cars";
import { FetchUserDataResponse, UserData } from "@/interfaces/user/user-details";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { error } from "console";
import { LatLngTuple } from "leaflet";

export class CarBookingServices {
    private client: ApolloClient<NormalizedCacheObject>;

    constructor(
        client: ApolloClient<NormalizedCacheObject>
    ) {
        this.client = client;
    }

    // fetch car data
    public fetchCarData = async (
        id: string | string[] | undefined,
        setCar: (car: FetchedCarData) => void
    ): Promise<void> => {
        try {
            if (typeof (id) === "string") {
                const carId = parseInt(id, 10)
                const { data } = await this.client.query<FetchCarByIdResponse>({
                    query: FETCH_CAR_BY_ID,
                    variables: {
                        id: carId
                    }
                });

                if (data.fetchCarById.status) {
                    setCar(data.fetchCarById.data);
                }
            }


        } catch (error) {
            console.error(error)
        }
    }

    //generate dates
    public getSelectedDates = async (
        setDate: (date: Date[]) => void
    ): Promise<void> => {
        // Fetch the dates from local storage
        const selectedDatesString = localStorage.getItem('selectedDates');

        // Parse the string into an array of Date objects
        if (selectedDatesString !== null) {

            const selectedDates = JSON.parse(selectedDatesString);

            // Check if the retrieved dates are valid
            if (!selectedDates || selectedDates.length !== 2) {
                console.error('Invalid date range stored in localStorage');
                setDate([]); // Set an empty array if dates are invalid
                return;
            }

            const startDate = new Date(selectedDates[0]);
            const endDate = new Date(selectedDates[1]);

            // Function to generate an array of dates between startDate and endDate
            const generateDateRange = (start: Date, end: Date): Date[] => {
                const dates: Date[] = [];
                const currentDate = new Date(start);

                while (currentDate <= end) {
                    dates.push(new Date(currentDate)); // Push a copy of the current date
                    currentDate.setDate(currentDate.getDate() + 1); // Increment date by 1 day
                }

                return dates;
            };

            // Generate the array of dates and update state
            const totalDates = generateDateRange(startDate, endDate);
            setDate(totalDates);
        }
    };

    //Create booking
    public createBooking = async (
        userId: number | undefined,
        bookedDates: Date[] | undefined,
        carModelId: number | undefined,
        deliveryLocation: string | null,
        returnLocation: string | null | undefined,
        secondaryMobileNumber: string,
        amount: Number | undefined
    ): Promise<void> => {
        try {
            const formattedDates = bookedDates?.map(date => date.toISOString());
            const input = {
                userId,
                bookedDates: formattedDates,
                carModelId,
                deliveryLocation,
                returnLocation,
                secondaryMobileNumber,
                amount
            };
            const { data } = await this.client.mutate<CreateBookingResponse>({
                mutation: CREATE_BOOKING,
                variables: {
                    input,
                },
            });

            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };



}