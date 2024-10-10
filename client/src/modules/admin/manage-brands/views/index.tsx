"use client";
import React, { useEffect, useState } from 'react'
import BrandTable from '../components/brands-table/brands-table'
import { Brand } from '@/interfaces/brands';
import styles from './manage-brands.module.css';
import { ManageBrandsClass } from '../services/manage-brands-services';
import {LoadingOutlined} from "@ant-design/icons";
import { ApolloClient, NormalizedCacheObject, useApolloClient } from '@apollo/client';
import { Spin } from 'antd';
import BrandsHeader from '../components/brands-header/brands-headet';
const ManageBrands = () => {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [brandData,setBrandData] = useState<Brand[]>([]);
  const [loading,setLoading] = useState(true);

  const manageBrandsClass = new ManageBrandsClass(client);

  useEffect(()=>{
    const fetchData = async () => {
      await manageBrandsClass.fetchBrands(setBrandData,setLoading);
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData();
  },[client])

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <Spin
          indicator={
            <LoadingOutlined
              style={{ fontSize: "70px", color: "rgb(0, 9, 79)" }}
              spin
            />
          }
        />
      </div>
    );
  }
  return (
    <div className={styles.brandTableWrapper}>
      <BrandsHeader />
      <BrandTable brandData={brandData} client={client}/>
    </div>
  )
}

export default ManageBrands
