import { ADD_BRAND } from "@/graphql/admin/mutations/add-brand-mutation";
import { COUNTRIES_QUERY } from "@/graphql/admin/queries/countries-query";
import { AddBrandResponse, CountriesResponse} from "@/interfaces/popular-brands";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import Swal from "sweetalert2";

export class AddBrandClass {


    public fetchCountries = async (
        client: ApolloClient<NormalizedCacheObject>,
        setCountries: (data: string[]) => void
    ): Promise<void> => {
        try {
            const { data } = await client.query<CountriesResponse>({
                query: COUNTRIES_QUERY,
            });

            // Assuming data.getCountries.data contains the array of countries
            if (data.getCountries.success) {
                // Extract country names and set them in setCountries
                const countryNames = data.getCountries.data.map(country => country.country);
                setCountries(countryNames); // Set the state with the country names
            } else {
                console.error(data.getCountries.message);
            }
        } catch (error) {
            console.error(error);
        }
    };



    public handleAddBrand = async (
        client: ApolloClient<NormalizedCacheObject>,
        brandName: string,
        brandLogo: File, // Ensure the type is File here
        country: string
    ): Promise<void> => {
        console.log("brand logo",brandLogo);
        try {
            // Check if brandLogo exists
            if (!brandLogo) {
                console.log("Brand logo is required.");
            }

            
            // Make the API call with the file
            const {data} = await client.mutate<AddBrandResponse>({
                mutation: ADD_BRAND,
                variables: {
                    name: brandName,
                    country: country,
                    image: brandLogo, // This should be a File object
                },
                context: {
                    hasUpload: true, // Important to enable file upload context
                },
            });


           if(!(data?.addBrand.success)){
            Swal.fire({
                title:"Error!",
                text:`${data?.addBrand.message}`,
                icon:"error",
                confirmButtonText:"continue"
            })
           }


            console.log("response data:",data);

        } catch (error) {
            console.error("Error in handleAddBrand:", error);
        }
    };
}
