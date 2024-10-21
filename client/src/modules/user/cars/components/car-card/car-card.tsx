import React from 'react';
import { Heart, Share, Info } from 'lucide-react';
import styles from './car-card.module.css';

interface CarOption {
  id: string;
  name: string;
  type: string;
  seats: number;
  bags: number;
  transmission: string;
  airConditioning: boolean;
  diesel?: boolean;
  price: number;
  image: string;
  provider: string;
}

interface CarRentalCardProps {
  car: CarOption;
}

const CarRentalCard: React.FC<CarRentalCardProps> = ({ car }) => {
  return (
    <div className={styles.carCard}>
      <div className={styles.cardHeader}>
        <div className={styles.actions}>
          <button className={styles.actionButton}>
            <Heart size={20} />
            Save
          </button>
          <button className={styles.actionButton}>
            <Share size={20} />
            Share
          </button>
        </div>
        <div className={styles.carInfo}>
          <h3>{car.name} <Info size={16} /></h3>
          <p>or similar {car.type}</p>
          <div className={styles.carSpecs}>
            <span>{car.seats} {car.seats === 1 ? 'person' : 'people'}</span>
            <span>{car.bags} {car.bags === 1 ? 'bag' : 'bags'}</span>
            <span>{car.transmission}</span>
            {car.airConditioning && <span>A/C</span>}
            {car.diesel && <span>D</span>}
          </div>
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.imageContainer}>
          <img src={car.image} alt={car.name} className={styles.carImage} />
          <div className={styles.providerTag}>{car.provider}</div>
        </div>
        <div className={styles.detailsContainer}>
          <div className={styles.rentalDetails}>
            <p>
              <span className={styles.icon}>✈</span> COK: Kochi Shuttle
            </p>
            <ul className={styles.features}>
              <li>✓ Fuel Policy: same-to-same</li>
              <li>✓ Unlimited mileage included</li>
              <li>✓ Third party coverage</li>
              <li>✓ Collision damage waiver</li>
              <li>✓ Theft protection waiver</li>
            </ul>
          </div>
          <div className={styles.priceDetails}>
            <span className={styles.vipTag}>VIP Cars</span>
            <p className={styles.price}>₹ {car.price.toLocaleString()}</p>
            <p className={styles.totalLabel}>Total</p>
            <button className={styles.viewDealButton}>View Deal</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRentalCard;