import { CarsProps } from '@/interfaces/cars';
import React, { FC } from 'react';
import styles from './car-card.module.css';

const CarCard:FC<CarsProps> = ({id,model,seats,fuel,transmission,price,image}) => {
  return (
    <div className={styles.card}>
      <img src={image} alt={`${model} image`} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h3>{model}</h3>
        <p>{seats} seats • {fuel} • {transmission}</p>
        <h4>{price} / Day</h4>
        <a href="#" className={styles.detailsLink}>View Details →</a>
      </div>
    </div>
  )
}

export default CarCard
