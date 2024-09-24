"use client";
import React, { useEffect, useState } from "react";
import styles from "./car-details.module.css";

interface CarDetailProps {
  id?: string;
  make: string;
  model: string;
  year: number;
  price: number;
  description: string;
  images: string[];
  type: string;
  seats: string;
  gear: string;
  doors:number;
  rating: number;
}

const car ={
    make: "Nissan",
    model: "GT-R",
    year: 2023,
    price: 80,
    description:
      "NISMO has become the embodiment of Nissan’s outstanding performance.",
    images: [
      "/images/cars/car.svg",
      "/images/cars/car.svg",
      "/images/cars/car.svg",
      "/images/cars/car.svg",
      "/images/cars/car.svg",
      "/images/cars/car.svg",
      "/images/cars/car.svg",
      "/images/cars/car.svg",
      "/images/cars/car.svg",
      
    ],
    type: "Sport",
    capacity: "2 Person",
    fuel: "70L",
    rating: 4.5,
  };

  const CarDetail = () => {
    const [currentImage, setCurrentImage] = useState(0);

    const handleNextImage = () => {
        setCurrentImage((prev) => (prev + 1) % car.images.length);
    };

    const handlePrevImage = () => {
        setCurrentImage((prev) => (prev === 0 ? car.images.length - 1 : prev - 1));
    };

    return (
        <div className={styles.container}>
            {/* Car Main Information Section */}
            <div className={styles.imageContainer}>
                <div className={styles.mainImage}>
                    <img src={car.images[currentImage]} alt={`${car.make} ${car.model}`} />
                </div>
                <div className={styles.thumbnailContainer}>
                    {car.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt="thumbnail"
                            className={currentImage === index ? styles.activeThumbnail : ''}
                            onClick={() => setCurrentImage(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Car Details Section */}
            <div className={styles.detailsContainer}>
                <h1>{`${car.make} ${car.model}`}</h1>
                <p className={styles.rating}>
                    {'★'.repeat(Math.round(car.rating))}{' '}
                    <span className={styles.reviews}>({}+ Reviewer)</span>
                </p>
                <p className={styles.description}>{car.description}</p>
                <div className={styles.specs}>
                    <div>Type: {car.type}</div>
                    <div>Capacity: {car.capacity}</div>
                    <div>Fuel: {car.fuel}</div>
                </div>
                <div className={styles.priceContainer}>
                    <span className={styles.price}>${car.price}/day</span>
                    <span className={styles.oldPrice}>${}</span>
                </div>
                <div className={styles.buttons}>
                    <button className={styles.rentButton}>Rent Now</button>
                    <button className={styles.wishlistButton}>Add to Wishlist</button>
                </div>
            </div>
        </div>
    );
};

export default CarDetail;