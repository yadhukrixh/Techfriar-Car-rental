"use client";
import React, { useEffect, useState } from "react";

import Filteration from "../components/filteration/filteration";
import SearchBar from "../components/search-bar/search-bar";
import styles from "./cars.module.css";
import GoogleMapPicker from "../components/map/location-picker";
import CarRentalCards from "../components/car-list/car-list";
import FilterationButton from "../components/filteration-button/filteration-button";
import { FetchedCarData } from "@/interfaces/user/cars";
import { ApolloClient, NormalizedCacheObject, useApolloClient } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { CarServices } from "../services/cars-services";

const Cars = () => {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement your search logic here
  };

  const [carList,setCarList] = useState<FetchedCarData[] | null>([]);
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const searchParams = useSearchParams();
  const selectedDates:string | null = searchParams.get('selectedDates');
  const carService = new CarServices(client);
  const [price, setPrice] = useState<number>(1000);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>([]);
  const [selectedCapacities, setSelectedCapacities] = useState<number[]>([]);
  const [sortType,setSortType] = useState('');

  useEffect(()=>{
    const fetchCars = async()=>{
      await carService.fetchAvailableCars(selectedDates,price,selectedFuelTypes,selectedTransmission,selectedCapacities,sortType,setCarList);
    }
    fetchCars();
  },[carList,price,selectedFuelTypes,selectedTransmission,selectedCapacities,sortType]);

  

   

  return (
    <div className={styles.carContainer}>
      <SearchBar onSearch={handleSearch} placeholder="Search cars..." />
      <div className={styles.mainContainer}>
        <div className={styles.sideBar}>
          <Filteration setMaxPrice={setPrice} setFuelType={setSelectedFuelTypes} setTransmission={setSelectedTransmission} setCapacities={setSelectedCapacities} setSortingType={setSortType} />
        </div>
        <div className={styles.carList}>
          <CarRentalCards carList={carList}/>
          <div className={styles.map}>
            <GoogleMapPicker />
          </div>
        </div>
      </div>
      <div className={styles.filterationButton}>
        <FilterationButton/>
      </div>
      
    </div>
  );
};

export default Cars;
