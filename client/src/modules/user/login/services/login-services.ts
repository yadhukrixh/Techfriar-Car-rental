import { LOGIN_MUTATION } from "@/graphql/user/mutations/login/login";
import { LoginResponse } from "@/interfaces/user/login";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import Cookies from 'js-cookie';
import Swal from "sweetalert2";

export class LoginClass{
    private client: ApolloClient<NormalizedCacheObject>;
    constructor(
        client: ApolloClient<NormalizedCacheObject>
    ) {
        this.client = client;
    }

    // Login user
    public loginUser = async(
        phoneNumber:string,
        password:string
    ):Promise<void> => {
        try{
            const {data} = await this.client.mutate<LoginResponse>({
                mutation:LOGIN_MUTATION,
                variables:{
                    mobileNumber:phoneNumber,
                    password:password
                }
            })
            if(data?.userLogin.status){
                Cookies.set('userId', (data.userLogin.data.userId).toString()|| '', { expires: 6 / 24, path: '/' });
                Swal.fire({
                    title: "User Registration Successfull!",
                    text: data.userLogin.message,
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
                    text: data?.userLogin.message,
                    icon: "error",
                    showConfirmButton: true
                })
            }
        }catch(error){
            console.error(error)
        }
    }
}