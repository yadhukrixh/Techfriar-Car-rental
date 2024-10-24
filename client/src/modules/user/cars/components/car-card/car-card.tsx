import React from "react";
import { Info } from "lucide-react";
import styles from "./car-card.module.css";
import { FetchedCarData } from "@/interfaces/user/cars";

interface CarRentalCardProps {
  car: FetchedCarData;
}

const CarRentalCard: React.FC<CarRentalCardProps> = ({ car }) => {
  return (
    <div className={styles.carCard}>
      <div className={styles.cardBody}>
        {/* image container */}
        <div className={styles.imageContainer}>
          <img
            src={car.primaryImage}
            alt={car.name}
            className={styles.carImage}
          />
          <div className={styles.providerTag}>{car.brandName}</div>
        </div>

        {/* car info */}
        <div className={styles.detailsContainer}>
          <div className={styles.carInfo}>
            <h3>
              {car.name}-{car.year} <Info size={16} />
            </h3>
            {/* <p>or similar {car.type}</p> */}
            <div className={styles.carSpecs}>
              <span>
                <img src="/icons/seat.svg" alt="" />
                {car.numberOfSeats}
              </span>
              <span>
                <img src="/icons/door.svg" alt="" />
                {car.numberOfDoors}
              </span>
              <span>
                <img src="/icons/gear.svg" alt="" />
                {car.transmissionType}
              </span>
              <span>
                <img src="/icons/fuel.svg" alt="" />
                {car.fuelType}
              </span>
            </div>
          </div>
          <div className={styles.rentalDetails}>
            <p>{car.description}</p>
          </div>
        </div>
        <div className={styles.priceDetails}>
          <p className={styles.price}>
            ₹ {car.pricePerDay.toLocaleString()}/Day
          </p>
          <button className={styles.viewDealButton}>Rent Now</button>
        </div>
      </div>
    </div>
  );
};

export default CarRentalCard;
