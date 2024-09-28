// interface for top brands
export interface PopularBrands {
  name: string;
  logo: string;
}


//  brand info for the admin
export interface Brand {
  id: number;
  logoUrl: string;
  name: string;
  country: string;
  numberOfCars: number;
};

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
    success: Boolean;
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
    success:Boolean;
    message:string;
  }
}

