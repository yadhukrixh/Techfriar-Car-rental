import React, { useState } from 'react';
import styles from './order-history.module.css';
import SearchBar from '@/modules/user/cars/components/search-bar/search-bar';
import OrderFilteration from '../sidebar/sidebar';
import { OrderData } from '@/interfaces/user/orders';

interface OrderHistoryProps{
    orderList:OrderData[];
    setSearchQuery:(query:string)=>void;
    setOrderStatus:(status:string)=>void;
    setTimePeriod:(period:string)=>void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({orderList,setSearchQuery,setOrderStatus,setTimePeriod}) => {
    
  return (
    <div className={styles.orderHistoryContainer}>
      <SearchBar setSearchQuery={setSearchQuery}/>
      <div className={styles.mainSection}>
        <OrderFilteration setOrderStatus={setOrderStatus} setTimePeriod={setTimePeriod} />
        <div>

        </div>
      </div>
    </div>
  )
}

export default OrderHistory;
