import React from 'react';
import styles from './order.module.css';
import PageHeader from '../components/page-header/page-header';
import OrderBody from '../components/order-body/order-body';

const Order = () => {
  return (
    <div className={styles.orderContainer}>
      <PageHeader/>
      <OrderBody/>
    </div>
  )
}

export default Order;
