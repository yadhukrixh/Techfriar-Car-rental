import React from 'react';
import styles from './car-list.module.css';
import CarRentalCard from '../car-card/car-card';

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

const carOptions: CarOption[] = [
  {
    id: '1',
    name: 'Suzuki Swift Dzire',
    type: 'Compact',
    seats: 4,
    bags: 2,
    transmission: 'M',
    airConditioning: true,
    price: 64047,
    image: '/api/placeholder/200/120',
    provider: 'Europcar',
  },
  {
    id: '2',
    name: 'Toyota Innova',
    type: 'Passenger van',
    seats: 7,
    bags: 5,
    transmission: 'M',
    airConditioning: true,
    diesel: true,
    price: 131248,
    image: '/api/placeholder/200/120',
    provider: 'Europcar',
  },
  {
    id: '3',
    name: 'Toyota Camry',
    type: 'Full-size',
    seats: 4,
    bags: 3,
    transmission: 'M',
    airConditioning: true,
    price: 189000,
    image: '/api/placeholder/200/120',
    provider: 'Europcar',
  },
];

const CarRentalList: React.FC = () => {
  return (
    <div className={styles.container}>
      {carOptions.map((car) => (
        <CarRentalCard key={car.id} car={car} />
      ))}
    </div>
  );
};

export default CarRentalList;