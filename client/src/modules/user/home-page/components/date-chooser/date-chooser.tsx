"use client";
import React, { useState } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import styles from "./date-chooser.module.css";
import "antd/dist/reset.css";

const { RangePicker } = DatePicker;

const DateChooser: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setSelectedDates(dates);
  };

  // Disable dates before today
  const disabledDate = (current: Dayjs) => {
    // Can not select days before today
    return current && current < dayjs().startOf("day");
  };

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
      />
      {selectedDates && (
        <div>
          <p>Delivery Date: {selectedDates[0]?.format("YYYY-MM-DD")}</p>
          <p>Return Date: {selectedDates[1]?.format("YYYY-MM-DD")}</p>
        </div>
      )}
    </div>
  );
};

export default DateChooser;
