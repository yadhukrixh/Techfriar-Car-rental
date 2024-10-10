"use client";
import React, { useEffect, useState } from 'react';
import styles from './rentable-car-form.module.css';
import { useSearchParams } from 'next/navigation';
import { ApolloClient, NormalizedCacheObject, useApolloClient } from '@apollo/client';
import { AddRentablecars } from '../../services/add-rentable-cars-service';
import { RentableModel } from '@/interfaces/rentable-cars';

const AddRentableForm = () => {
  const searchParams = useSearchParams(); // Get search params
  const id = searchParams.get('id') ? parseInt(searchParams.get('id')!, 10) : null;// Extract the 'id' from the query params
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const addRentableCars = new AddRentablecars(client);
  const [carData,setCarData] = useState<RentableModel>();

  useEffect(() => {
    const fetchCarData = async () => {
      if(id!==null){
        await addRentableCars.fetchCar(setCarData,id);
      }
    };
    fetchCarData();
  }, [id]);

  return (
    <div className={styles.rentableFormWrapper}>
      <h2></h2>
    </div>
  );
};

export default AddRentableForm;
