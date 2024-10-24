"use client";
import React, { useEffect, useState } from "react";
import { Slider, Modal, DatePicker } from "antd";
import styles from "./filteration.module.css";
import { FilterationComponentProps } from "@/interfaces/user/cars";
import dayjs, { Dayjs } from "dayjs";

const Filteration: React.FC<FilterationComponentProps> = ({
  setMaxPrice,
  setFuelType,
  setTransmission,
  setCapacities,
  setSortingType,
  selectedDates,
  setSelectedDates,
}) => {
  const [price, setPrice] = useState<number>(10000);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>([]);
  const [selectedCapacities, setSelectedCapacities] = useState<number[]>([]);
  const [sortType, setSortType] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updatedDates, setUpdatedDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // Set initial dates from selectedDates prop
  useEffect(() => {
    if (selectedDates.length === 2) {
      setUpdatedDates([dayjs(selectedDates[0]), dayjs(selectedDates[1])]);
    }
  }, [selectedDates]);

  const fuelTypes = [{ label: "Petrol" }, { label: "Diesel" }, { label: "EV" }];
  const transmissionTypes = [{ label: "Automatic" }, { label: "Manual" }];
  const capacities = [
    { label: "2 Person" },
    { label: "4 Person" },
    { label: "6 Person" },
    { label: "8 or More" },
  ];

  const handleCheckboxChange = (option: string, isChecked: boolean, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) =>
      isChecked ? [...prev, option] : prev.filter((item) => item !== option)
    );
  };

  const handleCapacityChange = (option: string, isChecked: boolean) => {
    const capacityValue = parseInt(option.split(" ")[0], 10);
    setSelectedCapacities((prev) =>
      isChecked ? [...prev, capacityValue] : prev.filter((item) => item !== capacityValue)
    );
  };

  const handlePriceChange = (value: number | number[]) => {
    if (typeof value === "number") {
      setPrice(value);
    } else {
      setPrice(value[0]);
    }
  };

  const handleClearSelections = () => {
    setSelectedFuelTypes([]);
    setSelectedTransmission([]);
    setSelectedCapacities([]);
    setPrice(10000);
    // Set selectedDates to current state instead of clearing
  };

  const sortAscending = () => {
    setSortType("ascending");
  };

  const sortDescending = () => {
    setSortType("descending");
  };

  // Update only valid dates
  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0];
      const endDate = dates[1];

      // If both dates are the same, adjust the return date
      if (startDate.isSame(endDate, "day")) {
        const newReturnDate = startDate.add(1, "day");
        const newSelectedDates = [
          startDate.toISOString(),
          newReturnDate.toISOString(),
        ];
        setUpdatedDates([startDate, newReturnDate]); // Keep the updated range for display
        setSelectedDates(newSelectedDates); // Update the main selected dates
      } else {
        const newSelectedDates = [
          startDate.toISOString(),
          endDate.toISOString(),
        ];
        setUpdatedDates([startDate, endDate]); // Keep the updated range for display
        setSelectedDates(newSelectedDates); // Update the main selected dates
      }
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    setMaxPrice(price);
    setFuelType(selectedFuelTypes);
    setTransmission(selectedTransmission);
    setCapacities(selectedCapacities);
    setSortingType(sortType);
  }, [price, selectedFuelTypes, selectedTransmission, selectedCapacities, sortType]);

  return (
    <div className={styles.filterMenu}>
      {/* Fuel Type Section */}
      <div className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>FUEL TYPE</h3>
        {fuelTypes.map((option) => (
          <label key={option.label} className={styles.filterOption}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedFuelTypes.includes(option.label)}
              onChange={(e) =>
                handleCheckboxChange(option.label, e.target.checked, setSelectedFuelTypes)
              }
            />
            <span className={styles.optionLabel}>{option.label}</span>
          </label>
        ))}
      </div>

      {/* Transmission Section */}
      <div className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>TRANSMISSION</h3>
        {transmissionTypes.map((option) => (
          <label key={option.label} className={styles.filterOption}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedTransmission.includes(option.label)}
              onChange={(e) =>
                handleCheckboxChange(option.label, e.target.checked, setSelectedTransmission)
              }
            />
            <span className={styles.optionLabel}>{option.label}</span>
          </label>
        ))}
      </div>

      {/* Capacity Section */}
      <div className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>CAPACITY</h3>
        {capacities.map((option) => (
          <label key={option.label} className={styles.filterOption}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedCapacities.includes(parseInt(option.label.split(" ")[0], 10))}
              onChange={(e) => handleCapacityChange(option.label, e.target.checked)}
            />
            <span className={styles.optionLabel}>{option.label}</span>
          </label>
        ))}
      </div>

      {/* Price Section */}
      <div className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>PRICE</h3>
        <div className={styles.priceSlider}>
          <Slider
            defaultValue={10000}
            max={10000}
            step={1}
            onChange={handlePriceChange}
          />
          <div className={styles.priceLabel}>Max. ₹{price}.00</div>
        </div>
        <div className={styles.sortButtons}>
          <button className={styles.sortButton} onClick={sortAscending}>
            <i className="ri-sort-asc"></i>
          </button>
          <button className={styles.sortButton} onClick={sortDescending}>
            <i className="ri-sort-desc"></i>
          </button>
        </div>
      </div>

      {/* Date Change Button */}
      <div className={styles.filterSection}>
        <button className={styles.dateButton} onClick={showModal}>
          Change Dates
        </button>
      </div>

      {/* Modal for Changing Dates */}
      <Modal
        title="Change Dates"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <DatePicker.RangePicker
          value={updatedDates}
          onChange={handleDateChange}
          disabledDate={(current) => current && current < dayjs().startOf('day')}
        />
      </Modal>

      <button className={styles.clearButton} onClick={handleClearSelections}>
        Clear All Selections
      </button>
    </div>
  );
};

export default Filteration;
