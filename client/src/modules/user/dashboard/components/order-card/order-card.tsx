"use client";
import React from "react";
import styles from "./order-card.module.css";
import { OrderData } from "@/interfaces/user/orders";
import { Tag } from "antd";
import { useRouter } from "next/navigation";

interface OrderProps {
  order: OrderData;
}

const OrderCard: React.FC<OrderProps> = ({ order }) => {
    const router = useRouter();
    const handleOnclick = () => {
        router.push(`/dashboard/orders/${order.orderId}`)
    }

  return (
    <div className={styles.cardContainer} onClick={handleOnclick}>

        {order.orderStatus !== "success" && (
        <div className={styles.disabled}></div>
      )}
      <div className={styles.orderInfo}>
        <img src={order.image} alt="" />
        <div className={styles.details}>
            <h2>{order.carName}</h2>
          {order.orderStatus === "success" && (
            <Tag color="green" className={styles.registrationNumber}>
              {order.registrationNumber}
            </Tag>
          )}
          <p>You booked at this: <b>{order.orderDate}</b></p>
        </div>
      </div>
      {order.completionStatus !== "N/A" &&
        <div className={styles.completionStatus}>
            <Tag color="blue">{(order.completionStatus)}</Tag>
        </div>
      }

      <div>
        <i className="ri-arrow-right-s-line"></i>
      </div>
    </div>
  );
};

export default OrderCard;
