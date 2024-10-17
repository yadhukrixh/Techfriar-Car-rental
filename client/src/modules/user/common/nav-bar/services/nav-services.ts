
import { PROFILE_PIC_MUTATION } from "@/graphql/user/mutations/fetch-user/get-profile-pic";
import { FetchProfilePicResponse, UserProfilePic } from "@/interfaces/user/user-details";
import { CookieClass } from "@/utils/cookies";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export class NavServices{
    private client: ApolloClient<NormalizedCacheObject>;
    constructor(
        client: ApolloClient<NormalizedCacheObject>
    ) {
        this.client = client;
    }

    //check user and fetch user data
    public fetchUserProfilePic = async(
        setUser:(data:UserProfilePic | undefined)=>void
    ):Promise<void> => {
        try{
            const cookieHandler = new CookieClass();
            const id = cookieHandler.getCookieValue("userId");
            const userId = parseInt(id?id:"",10)
            const {data} = await this.client.mutate<FetchProfilePicResponse>({
                mutation:PROFILE_PIC_MUTATION,
                variables:{
                    userId:2,
                }
            })

            console.log(data)

            if(data?.getProfilePic.status){
                setUser(data?.getProfilePic.data);
            }
        }catch(error){
            console.error(error)
        }
    }
}