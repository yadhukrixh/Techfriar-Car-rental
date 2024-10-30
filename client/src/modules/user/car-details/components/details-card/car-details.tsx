"use client";
import React, { useEffect, useState } from "react";
import { Image as AntdImage, Tag } from "antd"; // Import Ant Design Image
import styles from "./car-details.module.css";
import { FetchedCarData } from "@/interfaces/user/cars";
import { ApolloClient, NormalizedCacheObject, useApolloClient } from "@apollo/client";
import { CarBookingServices } from "../../services/car-booking-services";
import { useParams } from "next/navigation";
import ReviewComponent from "../user-review/user-review";
import BillingForm from "../billing-info/billing-info";
import { UserServices } from "@/modules/user/dashboard/services/user-services";
import { UserData } from "@/interfaces/user/user-details";
import PaymentInfo from "../payment-info/payment-info";

const CarDetailedView: React.FC = () => {
  // Apollo client and services initialization
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const carBookingService = new CarBookingServices(client);
  const userService = new UserServices(client);
  
  // URL parameters
  const { id } = useParams();

  // State management
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [car, setCar] = useState<FetchedCarData>();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>();
  const [showBillingStatus, setShowBillingStatus] = useState(false);
  const [userData, setUserData] = useState<UserData>({});
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState<number>();
  const [carBooked, setCarBooked] = useState(false);

  // Load Razorpay SDK
  useEffect(() => {
    const loadRazorpayScript = async () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onerror = () => console.error("Failed to load Razorpay SDK.");
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  // Fetch car data
  useEffect(() => {
    const fetchCar = async () => {
      await carBookingService.fetchCarData(id, setCar);
      await carBookingService.getSelectedDates(setSelectedDates);
    };
    fetchCar();
  }, [id]);

  // Fetch user data and calculate total price
  useEffect(() => {
    const fetchUserData = async () => {
      await userService.fetchUserData(setUserData);
    };
    
    const pricePerDay = car?.pricePerDay || 0; // Default to 0 if car is null or undefined
    setTotalPrice(pricePerDay * selectedDates.length); // Calculate total price
    fetchUserData();
  }, [selectedDates, car]);


  //handle cancel
  const handleCancel = async() => {
    await carBookingService.cancelBooking(bookingId);
  }
  

  // Handle payment process
  const handlePayment = async (amount: number | undefined) => {
    await carBookingService.handlePayment(amount, bookingId, setCarBooked);
  };

  // Toggle billing status visibility
  const handleRentNow = () => {
    setShowBillingStatus(prev => !prev);
  };

  // Prepare image gallery
  const allImages = [car?.primaryImage, ...(car?.secondaryImages ?? [])];

  return (
    <div className={styles.container}>
      <div className={styles.detailsGrid}>
        {/* Left Column - Image Gallery */}
        <div className={styles.imageGallery}>
          <div className={styles.mainImage}>
            <AntdImage
              src={allImages[selectedImage]}
              className={styles.imageContainer}
              preview={true}
            />
          </div>
          <div className={styles.thumbnails}>
            {allImages.map((image, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${selectedImage === index ? styles.selected : ""}`}
                onClick={() => setSelectedImage(index)}
              >
                <AntdImage
                  src={image}
                  width={60}
                  height={60}
                  preview={false}
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

          {!showBillingStatus || carBooked ? (
            <>
              <div className={styles.brand}>
                <Tag className={styles.customTag} color="success">
                  <img src={car?.brandLogo} alt="Brand Logo" className="tag-icon" />
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
                  <span className={styles.amount}>{totalPrice?.toFixed(2)}</span>
                </div>
              </div>

              <div className={styles.description}>
                <h2>About this item</h2>
                <p>{car?.description}</p>
              </div>
              {!carBooked ? (
                <>
                  <button className={styles.rentNowButton} onClick={handleRentNow}>
                    Rent Now
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => {
                      window.location.href = "/cars";
                    }}
                  >
                    Back
                  </button>
                </>
              ) : (
                <button className={styles.completed}>
                  <img src="/icons/car.gif" className={styles.carGif} alt="Car on the way" />
                  Car is On the way
                </button>
              )}
            </>
          ) : !showPayment ? (
            <BillingForm
              carModelId={car?.id}
              userData={userData}
              dates={selectedDates}
              amount={totalPrice}
              setShowPayment={setShowPayment}
              setBookingId={setBookingId}
              setShowBilling={setShowBillingStatus}
            />
          ) : (
            <PaymentInfo
              amount={totalPrice}
              setShowPaymentInfo={setShowPayment}
              handlePayment={handlePayment}
              cancelBooking={handleCancel}
            />
          )}
        </div>

        {/* Right Column - Review Box */}
        <div className={styles.reviewBox}>
          <ReviewComponent />
        </div>
      </div>
    </div>
  );
};

export default CarDetailedView;
