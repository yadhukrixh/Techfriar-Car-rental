import React from "react";
import styles from "./car-list.module.css";
import CarCard from "@/themes/car-card/car-card";
import { cars } from "../../../../../../public/data/cars";

const CarList = () => {
  return (
    <div className={styles.carListWrapper}>
      <div className={styles.carListHeading}>
        <h2>Explore our vehicles</h2>
        <div className={styles.viewAll}>
          <a href="/cars">View All <img src="/icons/arrow.svg" alt="" /></a>
        </div>
      </div>

      <div className={styles.carGrid}>
        {cars.slice(0, 6).map((car, index) => (
          <CarCard
            key={index}
            image={car.image}
            model={car.model}
            year={car.year}
            seats={car.seats}
            fuel={car.fuel}
            transmission={car.transmission}
            price={car.price}
          />
        ))}
      </div>
    </div>
  );
};

export default CarList;
