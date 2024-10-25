import React from 'react';
import styles from './car-details.module.css';
import ProductDetails from '../components/details-card/car-details';

const CarDetails = () => {
  return (
    <div className={styles.carDetailsContatiner}>
        <ProductDetails/>
    </div>
  )
}

export default CarDetails;
