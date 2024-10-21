"use client";
import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import styles from "./date-chooser.module.css";
import "antd/dist/reset.css";
import { useRouter } from "next/navigation";
import axios from "axios";
const { RangePicker } = DatePicker;

const DateChooser: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  const router = useRouter();

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      // If both dates are the same, set the return date to one day after the delivery date
      if (dates[0].isSame(dates[1], "day")) {
        const newReturnDate = dates[0].add(1, "day");
        setSelectedDates([dates[0], newReturnDate]); // Update with new return date
      } else {
        setSelectedDates(dates); // If dates are not the same, keep them as they are
      }
    } else {
      setSelectedDates(dates); // Handle null case
    }
  };

  // Disable dates before today
  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().startOf("day");
  };

  const handleNextPage = async() => {
    if(selectedDates){
      router.push(`/cars?selectedDates=${selectedDates}`)
    }
  }

  return (
    <div className={styles.container}>
      <h2>Start Your Journey</h2>
      <p style={{ fontSize: "16px", marginBottom: "20px" }}>
        Please select your preferred <strong>Delivery</strong> and{" "}
        <strong>Return</strong> dates for the vehicle.
      </p>
      <RangePicker
        onChange={handleDateChange}
        disabledDate={disabledDate}
        allowClear={false}
        inputReadOnly={true}
        value={selectedDates} // Set value to maintain consistency
      />
      {selectedDates && (
        <>
          <div className={styles.pickedDates}>
            <p>
              Delivery Date:{" "}
              <span>{selectedDates[0]?.format("DD-MM-YYYY")}</span>
            </p>
            <p>
              Return Date:{" "}
              <span>{selectedDates[1]?.format("DD-MM-YYYY")}</span>
            </p>
          </div>
          <button className={styles.viewVehicles} onClick={handleNextPage}>
            View Vehicles
            <i className="ri-arrow-right-double-line"></i>
          </button>
        </>
      )}
    </div>
  );
};

export default DateChooser;
