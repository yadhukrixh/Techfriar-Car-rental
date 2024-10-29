"use client";
import React, { useEffect, useState } from "react";
import styles from "./sidebar.module.css";
import { Modal } from "antd";

interface OrderFilterationProps{
    setOrderStatus:(satus:string)=>void;
    setTimePeriod:(period:string)=>void;
}

const OrderFilteration: React.FC<OrderFilterationProps> = ({
  setOrderStatus,
  setTimePeriod,
}) => {
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>("");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const orderStatuses = [
    { label: "Upcoming" },
    { label: "Returned" },
    { label: "Currently Running" },
  ];

  const timePeriods = [
    { label: "Last 30 Days" },
    { label: "In 6 Months" },
    { label: "In 1 Year" },
  ];

  const handleStatusChange = (option: string) => {
    setSelectedOrderStatus(option);
  };

  const handleTimePeriodChange = (option: string) => {
    setSelectedTimePeriod(option);
  };

  const handleClearSelections = () => {
    setSelectedOrderStatus("");
    setSelectedTimePeriod("");
  };

  useEffect(() => {
    setOrderStatus(selectedOrderStatus);
    setTimePeriod(selectedTimePeriod);
  }, [selectedOrderStatus, selectedTimePeriod]);

  return (
    <div className={styles.filterMenu}>
      {/* Order Status Section */}
      <div className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>ORDER STATUS</h3>
        {orderStatuses.map((option) => (
          <label
            key={option.label}
            className={`${styles.filterOption} ${
              selectedOrderStatus === option.label ? styles.selected : ""
            }`}
            onClick={() => handleStatusChange(option.label)}
          >
            <span className={styles.optionLabel}>{option.label}</span>
          </label>
        ))}
      </div>

      {/* Time Period Section */}
      <div className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>TIME PERIOD</h3>
        {timePeriods.map((option) => (
          <label
            key={option.label}
            className={`${styles.filterOption} ${
              selectedTimePeriod === option.label ? styles.selected : ""
            }`}
            onClick={() => handleTimePeriodChange(option.label)}
          >
            <span className={styles.optionLabel}>{option.label}</span>
          </label>
        ))}
      </div>

      <button className={styles.clearButton} onClick={handleClearSelections}>
        Clear All Selections
      </button>
    </div>
  );
};

export default OrderFilteration;
