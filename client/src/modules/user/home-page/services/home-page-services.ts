import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export class HomeServices{
    private client: ApolloClient<NormalizedCacheObject>;
    constructor(
        client: ApolloClient<NormalizedCacheObject>
    ) {
        this.client = client;
    }

    //pass tthe dates to the nextpage
    
}