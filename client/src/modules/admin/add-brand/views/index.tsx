"use client";

import React, { useEffect, useState } from 'react';
import styles from './add-brand.module.css';
import BackButton from '@/themes/back-button/back-button';
import { ApolloClient, NormalizedCacheObject, useApolloClient } from '@apollo/client';
import { AddBrandClass } from '../services/add-brand-service';

const AddBrand = () => {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [countries, setCountries] = useState<string[]>([]); // Initialize as an empty array

  

  const addBrandClass = new AddBrandClass();

  useEffect(() => {
    const fetchData = async () => {
      await addBrandClass.fetchCountries(client, setCountries);
    };

    fetchData(); // Call the async function
  }, [client]);

  return (
    <div>
      <BackButton />
      <label className={styles.custumFileUpload}>
        <div className={styles.icon}>
          <img src="/icons/folder.svg" alt="" />
        </div>
        <div className={styles.text}>
          <span>Click to upload image</span>
        </div>
        <input type="file" id="file" />
      </label>
      {/* Display countries if available */}
      {countries.length > 0 && (
        <select>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default AddBrand;
