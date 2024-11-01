import React from "react";
import styles from "./order-history.module.css";
import SearchBar from "@/modules/user/cars/components/search-bar/search-bar";
import OrderFilteration from "../sidebar/sidebar";
import { OrderData } from "@/interfaces/user/orders";
import OrderCard from "../order-card/order-card";
import { Empty } from "antd";

interface OrderHistoryProps {
  orderList: OrderData[];
  setSearchQuery: (query: string) => void;
  setOrderStatus: (status: string) => void;
  setTimePeriod: (period: string) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({
  orderList,
  setSearchQuery,
  setOrderStatus,
  setTimePeriod,
}) => {
  return (
    <div className={styles.orderHistoryContainer}>
      <SearchBar setSearchQuery={setSearchQuery} />
      <div className={styles.mainSection}>
        <div className={styles.filteration}>
          <OrderFilteration
            setOrderStatus={setOrderStatus}
            setTimePeriod={setTimePeriod}
          />
        </div>
        <div className={styles.orderList}>
          {orderList.length > 0 ? (
            orderList.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))
          ) : (
            <Empty description="No orders found" />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
