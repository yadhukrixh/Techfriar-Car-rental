import { FETCH_CAR_BY_ID } from "@/graphql/user/queries/fetch-available-cars/fetch-car-by-id";
import { FetchCarByIdResponse, FetchedCarData } from "@/interfaces/user/cars";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { error } from "console";

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
            if (typeof(id) === "string") {
                const carId = parseInt(id, 10)
                const { data } = await this.client.query<FetchCarByIdResponse>({
                    query: FETCH_CAR_BY_ID,
                    variables: {
                        id: carId
                    }
                });

                if(data.fetchCarById.status){
                    setCar(data.fetchCarById.data);
                }
            }


        } catch (error) {
            console.error(error)
        }
    }

}