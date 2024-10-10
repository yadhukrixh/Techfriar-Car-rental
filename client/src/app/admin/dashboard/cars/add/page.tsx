
import AddCars from '@/modules/admin/add-cars/views';
import styles from './add-cars.module.css';
import React from 'react';

const page = () => {
  return (
    <div className={styles.addVehicleWrapper}>
      <AddCars />
    </div>
  )
}

export default page
