"use client";
import React, { useEffect, useState } from "react";
import { Image as AntdImage, Tag } from "antd"; // Import Ant Design Image
import styles from "./car-details.module.css";
import { FetchedCarData } from "@/interfaces/user/cars";
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from "@apollo/client";
import { CarBookingServices } from "../../services/car-booking-services";
import { useParams } from "next/navigation";
import ReviewComponent from "../user-review/user-review";
import BillingForm from "../billing-info/billing-info";
import { UserServices } from "@/modules/user/dashboard/services/user-services";
import { UserData } from "@/interfaces/user/user-details";

const CarDetailedView: React.FC = () => {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const carBookingService = new CarBookingServices(client);
  const userService = new UserServices(client);
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [car, setCar] = useState<FetchedCarData>();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [totalPrice, setTotalPrice] = useState<Number>();
  const [showBillingStatus, setShowBillingStatus] = useState(false);
  const allImages = [car?.primaryImage, ...(car?.secondaryImages ?? [])];
  const [userData,setUserData] = useState<UserData>({});

  const handleRentNow  = () => {
    setShowBillingStatus(!showBillingStatus);
  }

  useEffect(() => {
    const fetchCar = async () => {
      await carBookingService.fetchCarData(id, setCar);
      await carBookingService.getSelectedDates(setSelectedDates);
    };

    fetchCar();
  }, [id]);

  useEffect(() => {
    // Calculate total price when selectedDates or car changes
    const pricePerDay = car?.pricePerDay || 0; // Default to 0 if car is null or undefined
    setTotalPrice(pricePerDay * selectedDates.length); // Calculate total price
    const fetchUser = async() => {
      await userService.fetchUserData(setUserData);
    }
    fetchUser();
  }, [selectedDates, car]);

  return (
    <div className={styles.container}>
      <div className={styles.detailsGrid}>
        {/* Left Column - Image Gallery */}
        <div className={styles.imageGallery}>
          <div className={styles.mainImage}>
            <AntdImage
              src={allImages[selectedImage]}
              className={styles.imageContainer}
              preview={true} // Disable default preview to maintain custom functionality
            />
          </div>
          <div className={styles.thumbnails}>
            {allImages.map((image, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${
                  selectedImage === index ? styles.selected : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <AntdImage
                  src={image}
                  width={60}
                  height={60}
                  preview={false} // Disable default preview
                />
              </div>
            ))}
          </div>
          <div className={styles.extraInfo}>
            <Tag color="orange" className={styles.listElement}>
              <img src="/icons/door.svg" alt="" />
              <p>{car?.numberOfDoors} DOORS</p>
            </Tag>
            <Tag color="orange" className={styles.listElement}>
              <img src="/icons/seat.svg" alt="" />
              <p>{car?.numberOfSeats} SEATS</p>
            </Tag>
            <Tag color="orange" className={styles.listElement}>
              <img src="/icons/fuel.svg" alt="" />
              <p>{car?.fuelType.toUpperCase()}</p>
            </Tag>
            <Tag color="orange" className={styles.listElement}>
              <img src="/icons/gear.svg" alt="" />
              <p>{car?.transmissionType.toUpperCase()}</p>
            </Tag>
          </div>
        </div>

        {/* Middle Column - Product Info */}
        <div className={styles.carInfo}>
          <h1 className={styles.title}>
            {car?.name}-{car?.year}
          </h1>

          {!showBillingStatus ? (
            <>
              <div className={styles.brand}>
                <Tag className={styles.customTag} color="success">
                  <img
                    src={car?.brandLogo}
                    alt="Custom Icon"
                    className="tag-icon"
                  />
                  {car?.brandName}
                </Tag>
              </div>

              <div className={styles.rating}>
                <span className={styles.reviewCount}>
                  ₹{car?.pricePerDay} / Day
                </span>
              </div>

              <div className={styles.priceSection}>
                Total Price:
                <div className={styles.price}>
                  <span className={styles.currency}>₹</span>
                  <span className={styles.amount}>
                    {totalPrice?.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className={styles.description}>
                <h2>About this item</h2>
                <p>{car?.description}</p>
              </div>

              <button className={styles.rentNowButton} onClick={handleRentNow}>Rent Now</button>
              <button className={styles.cancelButton}>Cancel</button>
            </>
          ):<BillingForm carModelId={car?.id} userData={userData} dates={selectedDates} amount={totalPrice}/>}
        </div>

        {/* Right Column - Buy Box */}
        <div className={styles.reviewBox}>
          <ReviewComponent />
        </div>
      </div>
    </div>
  );
};

export default CarDetailedView;
