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
import { style } from "framer-motion/client";

// Define the types for the image and product details
interface ProductImage {
  url: string;
  alt: string;
}

interface ProductDetails {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
}

const ProductDetails: React.FC = () => {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const carBookingService = new CarBookingServices(client);
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [car, setCar] = useState<FetchedCarData>();
  const allImages = [car?.primaryImage, ...(car?.secondaryImages ?? [])];

  useEffect(() => {
    const fetchCar = async () => {
      await carBookingService.fetchCarData(id, setCar);
    };

    fetchCar();
  }, [id]);

  const product: ProductDetails = {
    id: "1",
    title: "Premium Wireless Headphones",
    brand: "AudioTech",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.5,
    reviewCount: 2547,
  };

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
            <div className={styles.listElement}>
              <img src="/icons/door.svg" alt="" />
              <p>{car?.numberOfDoors} DOORS</p>
            </div>
            <div className={styles.listElement}>
              <img src="/icons/seat.svg" alt="" />
              <p>{car?.numberOfSeats} SEATS</p>
            </div>
            <div className={styles.listElement}>
              <img src="/icons/fuel.svg" alt="" />
              <p>{car?.fuelType.toUpperCase()}</p>
            </div>
            <div className={styles.listElement}>
              <img src="/icons/gear.svg" alt="" />
              <p>{car?.transmissionType.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Middle Column - Product Info */}
        <div className={styles.carInfo}>
          <h1 className={styles.title}>{car?.name}-{car?.year}</h1>
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
            <div className={styles.stars}>
              {"★".repeat(Math.floor(product.rating))}
              {"☆".repeat(5 - Math.floor(product.rating))}
            </div>
            <span className={styles.reviewCount}>
              {product.reviewCount.toLocaleString()} ratings
            </span>
          </div>

          <div className={styles.priceSection}>
            <div className={styles.price}>
              <span className={styles.currency}>₹</span>
              <span className={styles.amount}>
                {car?.pricePerDay.toFixed(2)}
              </span>
            </div>
          </div>

          <div className={styles.description}>
            <h2>About this item</h2>
            <p>{car?.description}</p>
          </div>

          <button className={styles.rentNowButton}>Rent Now</button>
          <button className={styles.cancelButton}>Cancel</button>
        </div>

        {/* Right Column - Buy Box */}
        <div className={styles.reviewBox}>
          <ReviewComponent />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
