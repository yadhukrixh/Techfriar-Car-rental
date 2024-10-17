import { REGISTER_USER } from "@/graphql/user/mutations/registration/register-user";
import { SEND_OTP } from "@/graphql/user/mutations/registration/send-otp";
import { VERIFY_OTP } from "@/graphql/user/mutations/registration/verify-otp";
import { RegisterUserResponse, SendOtpResponse, VerifyOtpResponse } from "@/interfaces/user/registration";
import { UserData } from "@/interfaces/user/user-details"
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { message } from "antd";
import Cookies from 'js-cookie';
import Swal from "sweetalert2";

export class HandleRegistration {

    private client: ApolloClient<NormalizedCacheObject>;
    constructor(
        client: ApolloClient<NormalizedCacheObject>
    ) {
        this.client = client;
    }

    // Save details to local storage
    public saveToLocalStorage = async (
        userForm: UserData
    ): Promise<void> => {
        try {
            // Convert the userForm object into a JSON string
            console.log("hi", userForm);
            const userDataString = JSON.stringify(userForm);

            // Save the JSON string to localStorage
            localStorage.setItem("userData", userDataString);

            console.log("User data saved to localStorage");
        } catch (error) {
            console.error("Error saving data to localStorage:", error);
        }
    }


    // Get data from localstorage
    public getFromLocalStorage = async (
        setForm: (data: UserData) => void
    ): Promise<void> => {
        try {
            const storedData = localStorage.getItem("userData");
            if (storedData) {
                const parsedData: UserData = await JSON.parse(storedData);
                console.log(storedData);
                setForm(parsedData);
            } else {
                console.warn("No userData found in localStorage");
            }
        } catch (error) {
            console.error("Error parsing localStorage data:", error);
        }
    }

    //send otp
    public sendOtpToPhoneNumber = async (
        number: string,
        setSendOtpStatus: (status: boolean) => void
    ): Promise<any> => {
        try {
            const phoneNumber = number
            const { data } = await this.client.mutate<SendOtpResponse>({
                mutation: SEND_OTP,
                variables: {
                    phoneNumber: phoneNumber
                }
            })
            if (data?.sendOtp.status) {
                setSendOtpStatus(true)
                message.success("Otp sent successfully");
            } else {
                message.error(data?.sendOtp.message);
            }

        } catch (error) {
            console.error("Error during sending OTP:", error);
            throw error; // Handle error appropriately
        }
    }

    // verify otp
    public verifyOtp = async (
        otp: string,
        setVerifiedStatus: (status: boolean) => void,
        phoneNumber: string
    ): Promise<void> => {
        try {
            const { data } = await this.client.mutate<VerifyOtpResponse>({
                mutation: VERIFY_OTP,
                variables: {
                    otp: otp,
                    phoneNumber: phoneNumber
                },
            });
            if (data?.verifyOtp.status) {
                setVerifiedStatus(true);
                Swal.fire({
                    title: "Verified!",
                    text: data.verifyOtp.message,
                    icon: "success",
                    showConfirmButton: true
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: data?.verifyOtp.message,
                    icon: "error",
                    showConfirmButton: true
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    // register user 
    public registerUser = async (
        formData: UserData
    ): Promise<void> => {
        try {
            const { data } = await this.client.mutate<RegisterUserResponse>({
                mutation: REGISTER_USER,
                variables: {
                    input: {
                        name: formData.name,
                        email: formData.email,
                        phoneNumber: formData.phoneNumber,
                        password: formData.password,
                        city: formData.city,
                        state: formData.state,
                        country: formData.country,
                        pincode: formData.pincode,
                    },
                }
            })
            if(data?.registerUser.status){
                Cookies.set('userId', (data.registerUser.data.userId).toString()|| '', { expires: 1 / 24, path: '/' });
                Swal.fire({
                    title: "User Registration Successfull!",
                    text: data.registerUser.message,
                    icon: "success",
                    showConfirmButton: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.removeItem("userData");
                        window.location.href = ('/');
                    }
                });
            }else{
                Swal.fire({
                    title: "Error!",
                    text: data?.registerUser.message,
                    icon: "error",
                    showConfirmButton: true
                })
            }
        } catch (error) {
            console.error(error);
        }
    }


}