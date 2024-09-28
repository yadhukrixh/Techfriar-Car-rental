import { ADD_BRAND } from "@/graphql/admin/mutations/add-brand-mutation";
import { COUNTRIES_QUERY } from "@/graphql/admin/queries/countries-query";
import {  AddBrandResponse, CountriesResponse, ImageFile } from "@/interfaces/popular-brands";
import client from "@/lib/apollo-client";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

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
    client:ApolloClient<NormalizedCacheObject>,
    brandName:string,
    brandLogo:ImageFile | null,
    country:string,
    
  ): Promise<void> => {
      console.log("Logging on the servics:",brandName,brandLogo,country)
      try{
        const response = await client.mutate<AddBrandResponse>({
            mutation: ADD_BRAND,
            variables: {
                name: brandName,
                country: country,
                image: brandLogo
              },
        });

        console.log("response",response)
      }catch(error){
        console.error(error);
      }
  }
}
