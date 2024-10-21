"use client";
import React from "react";

import Filteration from "../components/filteration/filteration";
import SearchBar from "../components/search-bar/search-bar";
import styles from "./cars.module.css";
import GoogleMapPicker from "../components/map/location-picker";
import CarRentalCards from "../components/car-list/car-list";

const Cars = () => {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement your search logic here
  };
  return (
    <div className={styles.carContainer}>
      <SearchBar onSearch={handleSearch} placeholder="Search cars..." />
      <div className={styles.mainContainer}>
        <div className={styles.sideBar}>
          <Filteration />
        </div>
        <div className={styles.carList}>
            <CarRentalCards/>
            <GoogleMapPicker />
        </div>
      </div>
    </div>
  );
};

export default Cars;
