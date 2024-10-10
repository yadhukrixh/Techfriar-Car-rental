import React from 'react';
import AddRentablesHeader from '../components/header/header';
import styles from './add-rentable.module.css';
import AddRentableForm from '../components/form/rentable-car-form';

const AddRentables = () => {
  return (
    <div className={styles.addRentables}>
      <AddRentablesHeader />
      <AddRentableForm />
    </div>
  )
}

export default AddRentables;
