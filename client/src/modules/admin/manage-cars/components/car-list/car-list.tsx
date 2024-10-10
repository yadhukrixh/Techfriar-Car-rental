"use client";
import React, { FC, useState } from "react";
import { Row, Col, message } from "antd";
import { CarData } from "@/interfaces/cars";
import CarCard from "../car-card/car-card";
import styles from "./car-list.module.css";
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from "@apollo/client";
import { ManageCars } from "../../services/manage-cars-services";
import CarModal from "../car-modal/car-modal";
import { useRouter } from "next/navigation";

interface CarListProps {
  cars: CarData[];
}

const CarList: FC<CarListProps> = ({ cars }) => {
  // create a class in here using constructor
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const manageCarsClass = new ManageCars(client);
  const router = useRouter();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCarData, setEditingCarData] = useState<CarData>();

  const handleOpenModal = (carData?: any) => {
    setEditingCarData(carData); // Pass car data to edit or null to add new car
    setIsModalVisible(true); // Show the modal
  };

  const handleCancelModal = () => {
    setIsModalVisible(false); // Hide the modal
  };

  const handleSaveCarData = (carData: any) => {
    // Here, you would handle the saving of car data to the backend or perform other logic
    console.log('Car data to save:', carData);
    setIsModalVisible(false); // Close the modal after saving
  };

  const handleEdit = (carData: any) => {
    setEditingCarData(carData);
    handleOpenModal(carData)
  };

  // handle d to rentables
  const handleAddToRentables = (carId: number) => {
    router.push(`/admin/dashboard/rentable-cars/add?id=${carId}`);
  }

  const handleDelete = async (carId: number) => {
    await manageCarsClass.deleteCar(carId);
    // Add your delete logic here
  };

  return (
    <>
      <Row gutter={[16, 16]} className={styles.carList}>
        {cars.map((car) => (
          <Col key={car.id} xs={24} sm={12} md={8} lg={6}>
            <CarCard car={car} onEdit={handleEdit} onDelete={handleDelete} onAddRentables={handleAddToRentables} />
          </Col>
        ))}
      </Row>

      <CarModal
        visible={isModalVisible}
        onCancel={handleCancelModal}
        onSave={handleSaveCarData}
        carData={editingCarData} // Pass car data for editing, or null for new car
       
      />
    </>
  );
};

export default CarList;
