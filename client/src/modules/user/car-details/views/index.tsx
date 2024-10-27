import React from 'react';
import styles from './car-details.module.css';
import CarDetailedView from '../components/details-card/car-details';

const CarDetails = () => {
  return (
    <div className={styles.carDetailsContatiner}>
        <CarDetailedView/>
    </div>
  )
}

export default CarDetails;
