"use client";
import React, { useEffect, useState } from "react";

import Filteration from "../components/filteration/filteration";
import SearchBar from "../components/search-bar/search-bar";
import styles from "./cars.module.css";
import GoogleMapPicker from "../components/map/location-picker";
import FilterationButton from "../components/filteration-button/filteration-button";
import { FetchedCarData } from "@/interfaces/user/cars";
import { Modal, Empty, Button } from "antd";
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from "@apollo/client";
import { CarServices } from "../services/cars-services";
import { LatLngTuple } from "leaflet";
import CarRentalList from "../components/car-list/car-list";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const Cars = () => {


  const [carList, setCarList] = useState<FetchedCarData[] | null>([]);
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const storedDates = localStorage.getItem("selectedDates");
  const initialDates = storedDates ? JSON.parse(storedDates) : [];

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
  const [selectedLocation, setSelectedLocation] = useState<LatLngTuple | null>(
    null
  );
  const router = useRouter();

  const [isMapModalVisible, setIsMapModalVisible] = useState(false);

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

  const handleRentNow = (id: number) => {
    if (selectedLocation === null) {
      setIsMapModalVisible(true); // Show modal to select location
    } else {
      Swal.fire({
        title: "Are you sure?",
        html: `You won't be able to change Dates,<br> Delivery: ${
          selectedDates[0].split("T")[0]
        } <br> Return: ${selectedDates[1].split("T")[0]}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff7f00",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, Rent Now!",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem("selectedDates", JSON.stringify(selectedDates));
          router.push(`/cars/${id}?location=${selectedLocation}`);
        }
      });
    }
  };

  const handleModalClose = () => {
    setIsMapModalVisible(false);
  };

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
            <CarRentalList carList={carList} onclickFunction={handleRentNow} />
          ) : (
            <Empty description="No cars found" style={{ width: "100%" }} />
          )}
          <div className={styles.map}>
            <GoogleMapPicker
              setLocation={setSelectedLocation}
              location={selectedLocation}
            />
          </div>
        </div>
      </div>
      <div className={styles.filterationButton}>
        <FilterationButton />
      </div>

      {/* Map Modal */}
      <Modal
        title="Select Location"
        visible={isMapModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        <GoogleMapPicker
          setLocation={setSelectedLocation}
          location={selectedLocation}
        />
      </Modal>
    </div>
  );
};

export default Cars;
