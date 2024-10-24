"use client";
import React, { useEffect, useState } from "react";

import Filteration from "../components/filteration/filteration";
import SearchBar from "../components/search-bar/search-bar";
import styles from "./cars.module.css";
import GoogleMapPicker from "../components/map/location-picker";
import CarRentalCards from "../components/car-list/car-list";
import FilterationButton from "../components/filteration-button/filteration-button";
import { FetchedCarData } from "@/interfaces/user/cars";
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from "@apollo/client";
import { CarServices } from "../services/cars-services";
import { Empty } from "antd";

const Cars = () => {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement your search logic here
  };

  const [carList, setCarList] = useState<FetchedCarData[] | null>([]);
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const storedDates = localStorage.getItem("selectedDates");
  const initialDates = storedDates ? JSON.parse(storedDates) : []; // Parse or set to []

  const [selectedDates, setSelectedDates] = useState<string[]>(initialDates);
  const carService = new CarServices(client);
  const [price, setPrice] = useState<number>(1000);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>(
    []
  );
  const [selectedCapacities, setSelectedCapacities] = useState<number[]>([]);
  const [sortType, setSortType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      await carService.fetchAvailableCars(
        selectedDates,
        price,
        selectedFuelTypes,
        selectedTransmission,
        selectedCapacities,
        sortType,
        setCarList,
        searchQuery
      );
    };
    fetchCars();
  }, [
    carList,
    price,
    selectedFuelTypes,
    selectedTransmission,
    selectedCapacities,
    sortType,
    selectedDates,
    searchQuery,
  ]);

  return (
    <div className={styles.carContainer}>
      <SearchBar setSearchQuery={setSearchQuery} placeholder="Search cars..." />
      <div className={styles.mainContainer}>
        <div className={styles.sideBar}>
          <Filteration
            setMaxPrice={setPrice}
            setFuelType={setSelectedFuelTypes}
            setTransmission={setSelectedTransmission}
            setCapacities={setSelectedCapacities}
            setSortingType={setSortType}
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
          />
        </div>
        <div className={styles.carList}>
          {(carList?.length ?? 0) > 0 ? (
            <CarRentalCards carList={carList} />
          ) : (
            <Empty description="No cars found" style={{width:"100%"}}/>
          )}
          <div className={styles.map}>
            <GoogleMapPicker />
          </div>
        </div>
      </div>
      <div className={styles.filterationButton}>
        <FilterationButton />
      </div>
    </div>
  );
};

export default Cars;
