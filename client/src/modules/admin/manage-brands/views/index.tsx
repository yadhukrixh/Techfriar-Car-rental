import React from "react";
import BrandsTable from "../components/brands-table/brands-table";
import ButtonComponent from "@/themes/button-component/button-component";
import styles from './manage-brands.module.css';

const ManageBrands = () => {
  const brands = [
    {
      id: 1,
      logoUrl: "/path-to-logo1.png",
      name: "Brand 1",
      country: "USA",
      numberOfCars: 50,
    },

    // more brands
  ];
  return (
    <div className={styles.manageBrandsWrapper}>
      <div className={styles.manageBrandsHeader}>
        <h2>Manage Brands</h2>
        <ButtonComponent value="Add Brands" />
      </div>

      <div className={styles.brandsTableWrapper}>
        {brands.length > 0 && (
          <BrandsTable
            brands={brands}
            onEdit={(id: any) => console.log(`Edit brand with id: ${id}`)}
            onDelete={(id: any) => console.log(`Delete brand with id: ${id}`)}
          />
        )}
        {brands.length <= 0 && (
          <div className={styles.addBrands}>
            <p>Add any brands to see</p>
            <ButtonComponent value="Add Brands" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBrands;
