"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from "@apollo/client";
import { ManageRentablecars } from "../../services/add-rentable-cars-service";
import { RentableModel, RentableCar } from "@/interfaces/rentable-cars";
import { Card, Button, Switch, Input, message, Empty, Tooltip } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import styles from "./rentable-car-form.module.css";
import RentableCard from "../rentable-card/rentable-card";

const AddRentableForm = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id")
    ? parseInt(searchParams.get("id")!, 10)
    : null;
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const addRentableCars = new ManageRentablecars(client);
  const [carData, setCarData] = useState<RentableModel>();
  const [showAddNew, setShowAddNew] = useState(false);
  const [newRegistration, setNewRegistration] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeStatus,setActiveStatus] = useState<boolean>(true);

  useEffect(() => {
    const fetchCarData = async () => {
      if (id !== null) {
        await addRentableCars.fetchCar(setCarData, id);
      }
    };
    fetchCarData();
  }, [id,showAddNew]);



  const handleAddNew = async () => {
    try {
      if (!newRegistration.trim()) {
        message.error("Please enter registration number");
        return;
      }
      setLoading(true);
      await addRentableCars.addrentableCar(newRegistration,carData?.id)
      setShowAddNew(false);
      setNewRegistration("");
    } catch (error) {
      message.error("Failed to add new car");
    } finally {
      setLoading(false);
    }
  };

  if (!carData) return null;

  const canAddMore = carData.rentableCars.length < carData.availableQuantity;

  return (
    <div className={styles.rentableFormWrapper}>
      <div className={styles.carDetailContainer}>
        {/* Left Side - Car Image */}

        {/* Right Side - Car Details */}
        <div className={styles.carInfoSection}>
          <div className={styles.carImageSection}>
            <Image
              src={carData.primaryImage}
              alt={carData.name}
              width={400}
              height={300}
              className={styles.primaryImage}
            />
          </div>

          <div className={styles.carHeader}>
            <div className={styles.nameYearSection}>
              <h2>{carData.name}</h2>
              <span className={styles.year}>{carData.year}</span>
            </div>

            <div className={styles.brandSection}>
              <Image
                src={carData.brandLogo}
                alt={carData.brandName}
                width={50}
                height={50}
                className={styles.brandLogo}
              />
              <span className={styles.brandName}>{carData.brandName}</span>
            </div>
          </div>
        </div>

        <div>
          {/* Add New Car Form */}
          <div className={styles.quantitySection}>
            <div className={styles.availabilityAndPrice}>
              <span style={{ border: "2px solid green", color: "green" }}>
                Available Quantity: {carData.availableQuantity} Nos
              </span>
              <span style={{ border: "2px solid blue", color: "blue" }}>
                Price Per Day: {carData.pricePerDay}/-
              </span>
            </div>
            {canAddMore && (
              <Tooltip title="Add New Car">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setShowAddNew(true)}
                  disabled={loading}
                  className={styles.addButton}
                />
              </Tooltip>
            )}
          </div>
          {showAddNew && (
            <div className={styles.addNewForm}>
              <Input
                placeholder="Enter Registration Number"
                value={newRegistration}
                onChange={(e) => {
                  const regex = /^[A-Z]{0,2}\d{0,2}[A-Z]{0,2}\d{0,4}$/; // Regex for Indian vehicle registration format
                  const inputValue = e.target.value
                    .toUpperCase()
                    .replace(/\s/g, ""); // Convert to uppercase and remove spaces

                  if (regex.test(inputValue)) {
                    setNewRegistration(inputValue); // Set value if it matches the regex
                  }
                }}
                disabled={loading}
              />

              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleAddNew}
                loading={loading}
              >
                Save
              </Button>
            </div>
          )}

          {/* Rentable Cars List */}
          <div className={styles.rentableCarsList}>
            <h3>Rentable Cars</h3>
            {carData.rentableCars.length > 0 ? (
              carData.rentableCars.map((car) => (
                <RentableCard 
                key={car.id}
                car={car}
                loading={loading}
                setLoading={setLoading}
                />
              ))
            ) : (
              <Empty description="No rentable cars available" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRentableForm;
