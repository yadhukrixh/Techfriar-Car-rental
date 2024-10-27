import { CREATE_BOOKING } from "@/graphql/user/mutations/create-booking/create-booking";
import { CREATE_RAZORPAY_ORDER } from "@/graphql/user/mutations/create-booking/create-razorpay-order/create-razorpay-order";
import { UPDATE_BOOKING } from "@/graphql/user/mutations/create-booking/update-booking/update-booking";
import { VERIFY_PAYMENT } from "@/graphql/user/mutations/create-booking/verify-payment/verify-payment";
import { FETCH_CAR_BY_ID } from "@/graphql/user/queries/fetch-available-cars/fetch-car-by-id";
import { CreateBookingResponse, CreateRazorPayOrderResponse, FetchCarByIdResponse, FetchedCarData, UpdateBookingResponse, VerifyPaymentResponse } from "@/interfaces/user/cars";
import { FetchUserDataResponse, UserData } from "@/interfaces/user/user-details";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { message } from "antd";
import { error } from "console";
import { LatLngTuple } from "leaflet";
import Swal from "sweetalert2";

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
        amount: Number | undefined,
        setShowPayment: (status: boolean) => void,
        setBookingId: (id: number) => void
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

            if (!(data?.createBooking.status)) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${data?.createBooking.message}`,
                });
            } else {
                setBookingId(data.createBooking.data.bookingId);
                setShowPayment(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    //handle payment 
    public handlePayment = async (
        amount: number | undefined,
        bookingId: number | undefined
    ): Promise<void> => {
        try {
            await this.createRazorPayOrder(amount, bookingId)
        } catch (error) {
            console.error(error)
        }
    }


    //create razorpay order
    public createRazorPayOrder = async (
        amount: number | undefined,
        bookingId: number | undefined
    ): Promise<void> => {
        // Check if amount is defined
        if (amount === undefined) {
            message.error('Amount is required for payment.');
            return;
        }

        try {
            const { data } = await this.client.mutate<CreateRazorPayOrderResponse>({
                mutation: CREATE_RAZORPAY_ORDER,
                variables: {
                    amount: amount
                }
            });

            // Check if order creation was successful
            if (data?.createRazorPayOrder.status && data.createRazorPayOrder.data.orderId) {
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: amount * 100, // Convert to paise
                    currency: 'INR',
                    name: 'Rentalia',
                    order_id: data.createRazorPayOrder.data.orderId,
                    handler: async (response: any) => { // Specify the type for response or use 'any'
                        try {
                            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
                            await this.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId);
                        } catch (error) {
                            console.error(error)
                        }
                    },
                    theme: { color: "#e77600" },
                };

                const razorpay = new (window as any).Razorpay(options);
                razorpay.open();
            } else {
                message.error('Order creation failed');
            }
        } catch (error) {
            console.error(error);
            message.error('An error occurred while processing the payment.');
        }
    };

    // verify payment
    public verifyPayment = async (
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string,
        bookingId: number | undefined
    ): Promise<void> => {
        try {
            const { data } = await this.client.mutate<VerifyPaymentResponse>({
                mutation: VERIFY_PAYMENT,
                variables: {
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    signature: razorpay_signature,
                }
            })
            if (data) {
                await this.updateBooking(bookingId,razorpay_payment_id,data.verifyPayment.status);
            }
        } catch (error) {
            console.error(error)
        }
    }

    //Update booking status
    public updateBooking = async (
        bookingId:number | undefined,
        razorpay_payment_id:string,
        verifiedStatus:boolean
    ):Promise<void> => {
        try{
            const {data} = await this.client.mutate<UpdateBookingResponse>({
                mutation:UPDATE_BOOKING,
                variables:{
                    bookingId:bookingId,
                    paymentId:razorpay_payment_id,
                    verifiedStatus:verifiedStatus
                }
            })
        }catch(error){
            console.error(error)
        }
    }




}