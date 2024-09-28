"use client";

import React, { useEffect, useState } from 'react';
import styles from './add-brand.module.css';
import BackButton from '@/themes/back-button/back-button';
import { ApolloClient, NormalizedCacheObject, useApolloClient } from '@apollo/client';
import { AddBrandClass } from '../services/add-brand-service';
import InputComponent from '@/themes/input-component/input-component';
import { ImageFile } from '@/interfaces/popular-brands';
import SelectorComponent from '@/themes/SelectorComponent/SelectorComponent';
import ButtonComponent from '@/themes/button-component/button-component';

const AddBrand = () => {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [countries, setCountries] = useState<string[]>([]); // Initialize as an empty array
  const [brandName,setBrandName] = useState('');
  const [brandLogo,setBrandLogo] = useState<ImageFile | null>({
    name:'',
    preview:''
  });
  const [selectedCountry,setSelectedCountry] = useState('');

  

  const addBrandClass = new AddBrandClass();

  useEffect(() => {
    const fetchData = async () => {
      await addBrandClass.fetchCountries(client, setCountries);
    };
    console.log("loging on page",selectedCountry,brandLogo)

    fetchData(); // Call the async function
  }, [client,selectedCountry,brandLogo]);

  return (
    <div>
      <BackButton />
      <InputComponent value={brandName} type='text' onChange={setBrandName} />
      <label className={styles.custumFileUpload}>
        <div className={styles.icon}>
          <img src="/icons/folder.svg" alt="" />
        </div>
        <div className={styles.text}>
          <span>{brandLogo?.file?brandLogo?.name:"Choose image"}</span>
        </div>
        <InputComponent value='' type='file' onChange={setBrandLogo} acceptType='Image/*'/>
      </label>
      {/* Display countries if available */}
      {countries.length > 0 && (
        <SelectorComponent options={countries} setSelectedValue={setSelectedCountry} placeholder='Select a country'/>
      )}

      <ButtonComponent value='Add brand' onClickFunction={()=>{addBrandClass.handleAddBrand(client,brandName,brandLogo,selectedCountry)}} />
    </div>
  );
};

export default AddBrand;
