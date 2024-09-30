import AddVehicle from '@/modules/admin/add-vehicle/views';
import styles from './add-vehicles.module.css';
import React from 'react';

const page = () => {
  return (
    <div className={styles.addVehicleWrapper}>
      <AddVehicle />
    </div>
  )
}

export default page
