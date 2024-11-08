"use client";

import React, { useEffect, useState } from "react";
import styles from "./order-body.module.css";
import { useParams } from "next/navigation";
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from "@apollo/client";
import { OrderDetails, UserData } from "@/interfaces/user/user-details";
import { OrderDetailsService } from "../../services/order-service";
import { Steps, Card, Typography } from "antd";

const { Title, Text } = Typography;

const OrderBody = () => {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [userData, setUserData] = useState<UserData>();
  const [orderData, setOrderData] = useState<OrderDetails>();
  const orderService = new OrderDetailsService(client);
  const { id } = useParams();
  const orderId = typeof id === "string" ? parseInt(id) : null;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      await orderService.fetchOrderDetails(orderId, setUserData, setOrderData);
    };
    fetchOrderDetails();
  }, [orderId]);

  const handleDownload = async() => {
    await orderService.downloadPdfByUser(orderData?.id);
  }

  return (
    <div className={styles.orderBodyContainer}>
      <Card className={styles.userInfoCard}>
        <Title level={4} className={styles.sectionTitle}>
          Billing Information
        </Title>
        <Text className={styles.userName}>{userData?.name}</Text>
        <Text className={styles.userContact}>{userData?.phoneNumber}</Text>
        <Text className={styles.userLocation}>
          {userData?.city}, {userData?.state}
        </Text>
      </Card>

      <Card className={styles.orderInfoCard}>
        <Title level={4} className={styles.sectionTitle}>
          Order Summary
        </Title>
        <div className={styles.orderImageContainer}>
          <div className={styles.carInfo}>
            <h3>
              {orderData?.carName} - {orderData?.carYear}
            </h3>
            <p>{orderData?.brandName}</p>
            <p>
              Booked Dates:{" "}
              {orderData?.bookedDates
                .map((date) => date.split("T")[0])
                .join(", ")}
            </p>
            <h3>Amount Paid: {orderData?.amount}/-</h3>
          </div>
          <img
            src={orderData?.carImage}
            alt="Car Image"
            className={styles.orderImage}
          />
        </div>

        <Steps
          direction="vertical"
          size="small"
          current={
            orderData?.status === "success"
              ? orderData.orderStatus === "upcoming"
                ? 2
                : 3
              : 1
          }
          status={
            orderData?.status === "success"
              ? orderData.orderStatus === "upcoming"
                ? "process"
                : orderData.orderStatus === "returned"
                ? "finish"
                : "process"
              : "error"
          }
          items={[
            {
              title: "Booked",
              description: `Date: ${
                orderData?.orderedDate
                  ? new Date(orderData.orderedDate).toLocaleDateString()
                  : "N/A"
              }`,
            },
            {
              title:
                orderData?.status === "success"
                  ? "Payment Completed"
                  : "Payment Failed",
              description:
                orderData?.status === "success"
                  ? "Payment was successful."
                  : "There was an issue with the payment.",
            },
            ...(orderData?.status === "success"
              ? [
                  {
                    title:
                      orderData.orderStatus === "upcoming"
                        ? "Upcoming"
                        : "Delivered",
                  },
                ]
              : []),
            ...(orderData?.status === "success"
              ? [
                  {
                    title:
                      orderData.orderStatus === "returned" ||
                      orderData.orderStatus === "ongoing"
                        ? "Ongoing"
                        : "Returned",
                  },
                ]
              : []),
          ]}
        />
      </Card>

      <Card className={styles.invoiceCard} onClick={handleDownload}>
        <div className={styles.cardBody}>
          <div className={styles.invoiceDownlod}>
            <i className="ri-article-line"></i>
            Download Invoice
          </div>
          <span className={styles.arrow}>
            <i className="ri-arrow-right-s-line"></i>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default OrderBody;
