import { FETCH_RENTABLE_CAR } from "@/graphql/admin/queries/rentable-cars/fetch-rentable-car";
import { FetchRentablecarsResponse, RentableModel } from "@/interfaces/rentable-cars";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export class AddRentablecars{
    private client: ApolloClient<NormalizedCacheObject>;
    constructor(
        client: ApolloClient<NormalizedCacheObject>
    ) {
        this.client = client;
    }

    public fetchCar = async (
        setCarData:(data:RentableModel)=>void,
        id?:number
        ):Promise<void> => {
        try{
            const {data} = await this.client.query<FetchRentablecarsResponse>({
                query:FETCH_RENTABLE_CAR,
                variables:{id},
            })
            if(data.fetchRentableCars.status){
                setCarData(data.fetchRentableCars.data);
            }

        }catch(error){
            console.error(error);
        }
    }
}