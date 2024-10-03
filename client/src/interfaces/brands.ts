// interface for top brands
export interface PopularBrands {
  name: string;
  logo: string;
}


//  brand info for the admin
export interface Brand {
  id: number; // Assuming id is always present
  logoUrl: string; // Assuming logoUrl is always present
  name: string; // Assuming name is always present
  country: string; // Assuming country is always present
  numberOfCars?: string; // Assuming numberOfCars is always present
}

export interface BrandTableProps {
  brands: Brand[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};


export interface Country {
  country: string; // Adjust based on your actual country field name
}

// interface of countries
export interface CountriesResponse {
  getCountries: {
    status: Boolean;
    message: string;
    data: Country[];
  };
}

// image file and brand form

export interface ImageFile{
  file?: File | null;  // The actual image file
  name: string | null;  // The name of the image file
  preview: string | null; // URL for the image preview
}

export interface AddBrandResponse{
  addBrand:{
    status:Boolean;
    message:string;
  }
}

// fetchBrands Response
export interface GetBrandsResponse{
  getBrands:{
      status:boolean;
      message:string;
      data:Brand[];
  }
}

// Delete brands response
export interface DeleteBrandResponse{
  deleteBrand:{
    status:boolean;
    message:string;
  }
}

// update brand response
export interface UpdateBrandResponse{
  updateBrand: {
    status:boolean;
    message:string;
  }
}

