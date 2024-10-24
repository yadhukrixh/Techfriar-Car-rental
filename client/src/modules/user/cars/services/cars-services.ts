
import { FETCH_AVAILABLE_CARS } from "@/graphql/user/queries/fetch-available-cars/fetch-available-cars";
import { FetchAvailableCarsResponse, FetchedCarData } from "@/interfaces/user/cars";
import { DateFormatter } from "@/utils/date-formatter";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export class CarServices{
    private client: ApolloClient<NormalizedCacheObject>;

    constructor(
        client: ApolloClient<NormalizedCacheObject>
    ) {
        this.client = client;
    }

    // fetch all cars from database

    public fetchAvailableCars = async (
        selectedDates: string | null,
        price: number,
        selectedFuelTypes: string[],
        selectedTransmission: string[],
        selectedCapacities: number[], // Assuming you want to use integers for capacities
        sortType: string,
        setCarList: (list: FetchedCarData[] | null) => void
    ): Promise<void> => {
        try {
            const dateFormatter = new DateFormatter();
            
            if (selectedDates) {
                const dateStrings = selectedDates.split(',').map(date => date.trim());
                const rawStartDate = dateStrings[1];
                const rawEnddate = dateStrings[3];
    
                const startDate = dateFormatter.formatDate(rawStartDate);
                const endDate = dateFormatter.formatDate(rawEnddate);
    
                const { data } = await this.client.query<FetchAvailableCarsResponse>({
                    query: FETCH_AVAILABLE_CARS,
                    variables: {
                        startDate: startDate,
                        endDate: endDate,
                        fuelTypes: selectedFuelTypes,
                        transmissionTypes: selectedTransmission,
                        capacities: selectedCapacities, // Corrected variable name
                        maxPrice: price,
                        sortType: sortType,
                    },
                });
    
                if (data.fetchAvailableCars.status) {
                    setCarList(data?.fetchAvailableCars.data);
                }
            }
    
        } catch (error) {
            console.error("Error fetching available cars:", error);
        }
    };
    
    
}