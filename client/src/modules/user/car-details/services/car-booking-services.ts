import { CREATE_BOOKING } from "@/graphql/user/mutations/create-booking/create-booking";
import { CREATE_RAZORPAY_ORDER } from "@/graphql/user/mutations/create-booking/create-razorpay-order/create-razorpay-order";
import { UPDATE_BOOKING } from "@/graphql/user/mutations/create-booking/update-booking/update-booking";
import { VERIFY_PAYMENT } from "@/graphql/user/mutations/create-booking/verify-payment/verify-payment";
import { FETCH_CAR_BY_ID } from "@/graphql/user/queries/fetch-available-cars/fetch-car-by-id";
import { CancelBookingResponse, CreateBookingResponse, CreateRazorPayOrderResponse, FetchCarByIdResponse, FetchedCarData, UpdateBookingResponse, VerifyPaymentResponse } from "@/interfaces/user/cars";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import confetti from 'canvas-confetti';
import { message } from "antd";
import Swal from "sweetalert2";
import { CANCEL_BOOKING } from "@/graphql/user/mutations/create-booking/cancel-booking/cancel-booking";

// Define the type for Razorpay options, which will be used in createRazorPayOrder
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    order_id: string;
    handler: (response: RazorpayResponse) => Promise<void>;
    theme: { color: string };
}

// Define the structure of Razorpay response to replace 'any' type in handler function
interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export class CarBookingServices {
    private client: ApolloClient<NormalizedCacheObject>;

    constructor(client: ApolloClient<NormalizedCacheObject>) {
        this.client = client;
    }

    // fetch car data
    public fetchCarData = async (
        id: string | string[] | undefined,
        setCar: (car: FetchedCarData) => void
    ): Promise<void> => {
        try {
            if (typeof id === "string") {
                const carId = parseInt(id, 10);
                const { data } = await this.client.query<FetchCarByIdResponse>({
                    query: FETCH_CAR_BY_ID,
                    variables: { id: carId },
                });

                if (data.fetchCarById.status) {
                    setCar(data.fetchCarById.data);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    // generate dates
    public getSelectedDates = async (setDate: (date: Date[]) => void): Promise<void> => {
        const selectedDatesString = localStorage.getItem("selectedDates");
        if (selectedDatesString) {
            const selectedDates = JSON.parse(selectedDatesString);
            if (selectedDates && selectedDates.length === 2) {
                const [startDate, endDate] = selectedDates.map((d: string) => new Date(d));
                const generateDateRange = (start: Date, end: Date): Date[] => {
                    const dates: Date[] = [];
                    const currentDate = new Date(start);
                    while (currentDate <= end) {
                        dates.push(new Date(currentDate));
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                    return dates;
                };
                setDate(generateDateRange(startDate, endDate));
            } else {
                console.error("Invalid date range stored in localStorage");
                setDate([]);
            }
        }
    };

    // Create booking
    public createBooking = async (
        userId: number | undefined,
        bookedDates: Date[] | undefined,
        carModelId: number | undefined,
        deliveryLocation: string | null,
        returnLocation: string | null | undefined,
        secondaryMobileNumber: string,
        amount: number | undefined,
        setShowPayment: (status: boolean) => void,
        setBookingId: (id: number) => void
    ): Promise<void> => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to edit these!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Continue",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const formattedDates = bookedDates?.map((date) => date.toISOString());
                    const input = { userId, bookedDates: formattedDates, carModelId, deliveryLocation, returnLocation, secondaryMobileNumber, amount };
                    const { data } = await this.client.mutate<CreateBookingResponse>({
                        mutation: CREATE_BOOKING,
                        variables: { input },
                    });

                    if (data?.createBooking.status) {
                        setBookingId(data.createBooking.data.orderId);
                        setShowPayment(true);
                    } else {
                        Swal.fire({ icon: "error", title: "Oops...", text: `${data?.createBooking.message}` });
                    }
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    // handle payment
    public handlePayment = async (
        amount: number | undefined,
        bookingId: number | undefined,
        setCarBooked: (status: boolean) => void
    ): Promise<void> => {
        try {
            await this.createRazorPayOrder(amount, bookingId, setCarBooked);
        } catch (error) {
            console.error(error);
        }
    };

    // create Razorpay order
    public createRazorPayOrder = async (
        amount: number | undefined,
        bookingId: number | undefined,
        setCarBooked: (status: boolean) => void
    ): Promise<void> => {
        if (amount === undefined) {
            message.error("Amount is required for payment.");
            return;
        }

        try {
            const { data } = await this.client.mutate<CreateRazorPayOrderResponse>({
                mutation: CREATE_RAZORPAY_ORDER,
                variables: { amount },
            });

            if (data?.createRazorPayOrder.status && data.createRazorPayOrder.data.orderId) {
                const options: RazorpayOptions = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
                    amount: amount * 100,
                    currency: "INR",
                    name: "Rentalia",
                    order_id: data.createRazorPayOrder.data.orderId,
                    handler: async (response: RazorpayResponse) => {
                        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
                        await this.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, setCarBooked);
                    },
                    theme: { color: "#e77600" },
                };

                const razorpay = new (window as any).Razorpay(options);
                razorpay.open();
            } else {
                message.error("Order creation failed");
            }
        } catch (error) {
            console.error(error);
            message.error("An error occurred while processing the payment.");
        }
    };

    // verify payment
    public verifyPayment = async (
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string,
        bookingId: number | undefined,
        setCarBooked: (status: boolean) => void
    ): Promise<void> => {
        try {
            const { data } = await this.client.mutate<VerifyPaymentResponse>({
                mutation: VERIFY_PAYMENT,
                variables: { orderId: razorpay_order_id, paymentId: razorpay_payment_id, signature: razorpay_signature },
            });
            if (data) {
                await this.updateBooking(bookingId, razorpay_payment_id, data.verifyPayment.status);
                if (data.verifyPayment.status) {
                    confetti({ particleCount: 100, spread: 100, origin: { y: 0.6 } });
                    setCarBooked(true);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Update booking status
    public updateBooking = async (
        bookingId: number | undefined,
        razorpay_payment_id: string,
        verifiedStatus: boolean
    ): Promise<void> => {
        try {
            await this.client.mutate<UpdateBookingResponse>({
                mutation: UPDATE_BOOKING,
                variables: { bookingId, paymentId: razorpay_payment_id, verifiedStatus },
            });
        } catch (error) {
            console.error(error);
        }
    };

    // cancel booking
    public cancelBooking = async (bookingId: number | undefined): Promise<void> => {
        try {
            const { data } = await this.client.mutate<CancelBookingResponse>({
                mutation: CANCEL_BOOKING,
                variables: { bookingId },
            });
            if (data?.cancelBooking.status) {
                message.success({
                    content: "Booking Canceled",
                    style: { position: "absolute", top: "150px", left: "50%", transform: "translateX(-50%)" },
                });
            }
        } catch (error) {
            console.error(error);
        }
    };
}
