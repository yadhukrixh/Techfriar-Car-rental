import { DELETE_BRAND } from "@/graphql/admin/mutations/brands/delete-brand-mutation";
import { UPDATE_BRAND } from "@/graphql/admin/mutations/brands/edit-brand-mutation";
import { BRANDS_QUERY } from "@/graphql/admin/queries/brands/brands-query";
import { Brand, DeleteBrandResponse, GetBrandsResponse, UpdateBrandResponse } from "@/interfaces/admin/brands";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import Swal from "sweetalert2";


export class ManageBrandsClass {
    private client: ApolloClient<NormalizedCacheObject>;
    constructor(
        client: ApolloClient<NormalizedCacheObject>
    ) {
        this.client = client;
    }

    // fetch brand data
    public fetchBrands = async (
        setBrands: (data: Brand[]) => void,
        setLoading: (status: boolean) => void
    ): Promise<void> => {
        try {
            const { data } = await this.client.query<GetBrandsResponse>({
                query: BRANDS_QUERY,
            });
            if (data.getBrands.status) {
                const formattedBrands: Brand[] = data.getBrands.data.map((brand: Brand) => ({
                    id: Number(brand.id),         // Converting string id to number
                    logoUrl: brand.logoUrl,      // Mapping imageUrl to logoUrl
                    name: brand.name,             // Directly mapping name
                    country: brand.country,
                    numberOfCars: (brand.numberOfCars)
                }));
                setBrands(formattedBrands);
                setLoading(false)
            }

        } catch (error) {
            console.error(error)
        }
    }

    // delete brand
    public deleteBrand = async (
        brandId: number,
    ): Promise<void> => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "Brand will be deleted along with assigned vehicles on this brand!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { data } = await this.client.mutate<DeleteBrandResponse>({
                        mutation: DELETE_BRAND,
                        variables: {
                            id: brandId,
                        },
                    });

                    if (data?.deleteBrand.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Brand has been deleted succesfully",
                            icon: "success",
                            showConfirmButton: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload()
                            }
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: data?.deleteBrand.message,
                            icon: "error",
                            showConfirmButton: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload()
                            }
                        });
                    }

                }
            });

        } catch (error) {
            console.error(error);
        }
    }

    // Update brand Data
    public updateBrand = async (
        id: number,
        name: string,
        country: string,
        image: File | null,
        onClose: () => void
    ): Promise<void> => {
        try {
            Swal.fire({
                title: "Save Changes?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Save"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { data } = await this.client.mutate<UpdateBrandResponse>({
                        mutation: UPDATE_BRAND,
                        variables: {
                            id: id,
                            name: name,
                            country: country,
                            image: image,
                        },
                    });
                    if (data?.updateBrand.status) {
                        Swal.fire({
                            title: "Saved!",
                            text: "Brand updated succesfully",
                            icon: "success",
                            showConfirmButton: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                onClose();
                                window.location.reload()
                            }
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: data?.updateBrand.message,
                            icon: "error",
                            showConfirmButton: true
                        });
                    }
                }
            });
        } catch (error) {
            console.error(error)
        }
    }
}