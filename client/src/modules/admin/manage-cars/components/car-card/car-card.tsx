import React, { FC, useRef } from "react";
import { Card, Button, Image, Tag, Space, Carousel } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import styles from "./car-card.module.css";
import { CarData } from "@/interfaces/cars";

interface CarCardProps {
  car: CarData;
  onEdit: (car: CarData) => void; // Edit callback
  onDelete: (carId: number) => void; // Delete callback
  onAddRentables:(carId: number)=>void;
}

const CarCard: FC<CarCardProps> = ({ car, onEdit, onDelete, onAddRentables }) => {
  const carouselRef = useRef<any>(null);
  const allImages = [car.primaryImage, ...car.otherImages];
  return (
    <Card
      className={styles.card}
      cover={
        <div className={styles.carouselContainer}>
          <div className={styles.carouselNavButtons}>
            <Button
              className={styles.arrowButton}
              icon={<LeftOutlined />}
              onClick={() => carouselRef.current?.prev()} // Navigate to previous image
            />
            <Button
              className={styles.arrowButton}
              icon={<RightOutlined />}
              onClick={() => carouselRef.current?.next()} // Navigate to next image
            />
          </div>

          <Carousel
            ref={carouselRef}
            autoplay={false}
            className={styles.carousal}
          >
            {allImages.map((image, index) => (
              <div key={index}>
                <Image
                  alt={car.name}
                  src={image}
                  width="100%"
                  height="auto"
                  preview={false} // Disable preview behavior
                />
              </div>
            ))}
          </Carousel>
        </div>
      }
    >
      <div className={styles.cardHeader}>
        <Image src={car.brandLogo} alt={car.brandName} width={50} height={50} />
        <div className={styles.carDetails}>
          <h3>{car.name}</h3>
          <p>{car.year} / {car.brandName}</p>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.tags}>
          <Tag color="blue">{car.fuelType}</Tag>
          <Tag color="blue">{car.transmissionType}</Tag>
          <Tag color="blue">Seats: {car.numberOfSeats}</Tag>
          <Tag color="blue">Doors: {car.numberOfDoors}</Tag>
        </div>
        <div className={styles.additionalDetails}>
          <div style={{display:"flex", flexDirection:"row"}}>
            <Tag color="black" style={{ width: "max-content" }}>
              <p>Available: {car.availableQuantity}</p>
            </Tag>
            <Tag color="black" style={{ width: "max-content" }}>
              <p>{car.pricePerDay}/Day</p>
            </Tag>
          </div>
          <p>{car.description}</p>
        </div>
      </div>
      <Space
        className={styles.cardActions}
        style={{ marginTop: "16px" }}
        size="middle"
      >
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => onEdit(car)}
        />

        <Button
        style={{backgroundColor:"black", fontWeight:"700"}}
          icon={<PlusOutlined style={{fontWeight:"700", color:"white"}}/>}
          onClick={() => onAddRentables(car.id)} 
        />

        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(car.id)}
        />
      </Space>
    </Card>
  );
};

export default CarCard;
