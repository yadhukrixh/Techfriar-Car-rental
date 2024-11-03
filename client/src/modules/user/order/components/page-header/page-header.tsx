"use client"
import React from 'react';
import styles from './page-header.module.css';

const PageHeader = () => {
  return (
    <div className={styles.pageHeaderContainer}>
      <button><i className="ri-arrow-left-line"></i></button>
      <h2>Order Details</h2>
    </div>
  )
}

export default PageHeader;
