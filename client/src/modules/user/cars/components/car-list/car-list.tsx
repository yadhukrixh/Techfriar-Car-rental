import React from 'react';
import styles from './car-list.module.css';
import CarRentalCard from '../car-card/car-card';
import { CarRentalListComponentProps } from '@/interfaces/user/cars';

const CarRentalList: React.FC<CarRentalListComponentProps> = ({ carList }) => {
  return (
    <div className={styles.container}>
      {carList?.map((car) => (
        <CarRentalCard key={car.id} car={car} />
      ))}
    </div>
  );
};

export default CarRentalList;
