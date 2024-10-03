"use client";


import React, { FC, useState } from 'react';
import styles from './brands.module.css';
import { PopularBrands } from '@/interfaces/brands';
import { carBrands } from '../../../../../../public/data/popular-brands';

const Brands = () => {
    const [brands,setBrands] = useState<PopularBrands[]>(carBrands)
  return (
    <div className={styles.container}>
      <h2>We work with Premium Brands</h2>
      <div className={styles.grid}>
        {brands.map((brand) => (
          <div key={brand.name} className={styles.brand}>
            <img src={brand.logo} alt={brand.name} width={60} height={60} />
            <span>{brand.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Brands;
