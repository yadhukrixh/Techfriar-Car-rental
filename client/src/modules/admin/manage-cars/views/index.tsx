"use client";
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from "@apollo/client";
import React, { useEffect, useState } from "react";
import { ManageCars } from "../services/manage-cars-services";
import { CarData } from "@/interfaces/admin/cars";
import CarList from "../components/car-list/car-list";
import {LoadingOutlined} from "@ant-design/icons";
import ManageCarsHeader from "../components/manage-cars-header/manage-cars-header";
import styles from "./manage-cars.module.css";
import { Spin } from "antd";

const ManageAllCars = () => {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const manageCarsClass = new ManageCars(client);
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await manageCarsClass.getAllCars(setCars);
      setLoading(false);
    };
    fetchData();
  }, [client]);

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <Spin
          indicator={
            <LoadingOutlined
              style={{ fontSize: "70px", color: "rgb(0, 9, 79)" }}
              spin
            />
          }
        />
      </div>
    );
  }
  return (
    <div className={styles.manageCarsWrapper}>
      <ManageCarsHeader />
      <CarList cars={cars} />
    </div>
  );
};

export default ManageAllCars;
