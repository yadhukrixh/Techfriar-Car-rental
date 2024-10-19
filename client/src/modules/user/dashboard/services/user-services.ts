import { UPDATE_USER_DETAILS_MUTATION } from "@/graphql/user/mutations/update-profile/update-details";
import { UPDATE_PROFILE_PICTURE } from "@/graphql/user/mutations/update-profile/update-profile-picture";
import { FETCH_USER_DATA } from "@/graphql/user/queries/fetch-user/fetch-user";
import { FetchUserDataResponse, OrdersData, UpdateProfilePictureResponse, UpdateUSerDetailsResponse, UserData } from "@/interfaces/user/user-details";
import { CookieClass } from "@/utils/cookies";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import Swal from "sweetalert2";

export class UserServices {
    private client: ApolloClient<NormalizedCacheObject>;
    constructor(
        client: ApolloClient<NormalizedCacheObject>
    ) {
        this.client = client;
    }

    // feth data of user
    public fetchUserData = async (
        setUser: (user: UserData) => void
    ): Promise<void> => {
        try {
            const cookieClass = new CookieClass();
            const userIdString = cookieClass.getCookieValue("userId");

            // Check if userIdString is null or not
            if (!userIdString) {
                throw new Error("No userId cookie found");
            }

            const userId = parseInt(userIdString, 10);

            // Check if userId is a valid number
            if (isNaN(userId)) {
                throw new Error("Invalid userId from cookie");
            }

            const { data } = await this.client.query<FetchUserDataResponse>({
                query: FETCH_USER_DATA,
                variables: {
                    id: userId
                }
            });

            // Set the user data if fetched successfully
            if (data.fetchUserData.status) {
                setUser(data.fetchUserData.data);
            } else {
                console.error("Failed to fetch user data:", data.fetchUserData.message);
            }
        } catch (error) {
            console.error("Error in fetchUserData:", error);
        }
    }


    //fetch orders
    public fetchOrders = async (
        setOrders: (order: OrdersData) => void
    ): Promise<void> => {
        try {

        } catch (error) {
            console.error(error)
        }
    }

    //handle uplaod
    public updateProfilePicture = async (
        image: File | undefined
    ): Promise<void> => {
        try {
            const cookieClass = new CookieClass();
            const userIdString = cookieClass.getCookieValue("userId");

            // Check if userIdString is null or not
            if (!userIdString) {
                throw new Error("No userId cookie found");
            }

            const userId = parseInt(userIdString, 10);

            // Check if userId is a valid number
            if (isNaN(userId)) {
                throw new Error("Invalid userId from cookie");
            }
            const { data } = await this.client.mutate<UpdateProfilePictureResponse>({
                mutation: UPDATE_PROFILE_PICTURE,
                variables: {
                    userId: userId,
                    profileImage: image
                }
            });
            if(data?.updateProfilePic.status){
                Swal.fire({
                    title: "Image Updated successfully!",
                    icon: "success",
                    showConfirmButton: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            }else{
                Swal.fire({
                    title: "Failed to Update",
                    text:data?.updateProfilePic.message,
                    icon: "error",
                    showConfirmButton: true
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    // update user details
    public updateUserDetails = async (
        userData:UserData | undefined
    ):Promise<void> => {
        try{
            const cookieClass = new CookieClass();
            const userIdString = cookieClass.getCookieValue("userId");

            // Check if userIdString is null or not
            if (!userIdString) {
                throw new Error("No userId cookie found");
            }

            const userId = parseInt(userIdString, 10);

            // Check if userId is a valid number
            if (isNaN(userId)) {
                throw new Error("Invalid userId from cookie");
            }

            if(userData?.password !== userData?.confirmPassword){
                Swal.fire({
                    title: "password Mismatched!",
                    text:"Password mismatch",
                    icon: "error",
                    showConfirmButton: true
                });
                return;
            }

            const variables = {
                id: userId,
                name: userData?.name || null,
                email: userData?.email || null,
                password: userData?.password || null,
                city: userData?.city || null,
                state: userData?.state || null,
                country: userData?.country || null,
                pincode: userData?.pincode || null,
            };
    
            // Call the mutation and update the user details
            const { data } = await this.client.mutate<UpdateUSerDetailsResponse>({
                mutation: UPDATE_USER_DETAILS_MUTATION,
                variables: variables,
            });

            if(data?.updateUserDetails.status){
                Swal.fire({
                    title: "Details Updated successfully!",
                    text:data.updateUserDetails.message,
                    icon: "success",
                    showConfirmButton: true
                });
            }else{
                Swal.fire({
                    title: "Failed to Update",
                    text:data?.updateUserDetails.message,
                    icon: "error",
                    showConfirmButton: true
                });
            }
        }catch(error){
            console.error(error)
        }
    }
}