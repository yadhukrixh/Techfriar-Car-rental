"use client";
import React from 'react';
import styles from './rentable-header.module.css';
import BackButton from '@/themes/back-button/back-button';

const AddRentablesHeader = () => {
  return (
    <div className={styles.headerWrapper}>
      <BackButton />
      <h2>Add Rentable car</h2>
    </div>
  )
}

export default AddRentablesHeader;
