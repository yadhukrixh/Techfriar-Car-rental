"use client";
import React, { useEffect, useState } from 'react';
import { Slider, Modal, DatePicker } from 'antd'; // Added Modal and DatePicker components
import styles from './filteration.module.css';
import { FilterationComponentProps } from '@/interfaces/user/cars';
import dayjs, { Dayjs } from 'dayjs'; // For handling date formatting

type FilterOption = {
  label: string;
  count: number;
};

const Filteration: React.FC<FilterationComponentProps> = ({setMaxPrice,setFuelType,setTransmission,setCapacities,setSortingType}) => {
  const [price, setPrice] = useState<number>(10000);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>([]);
  const [selectedCapacities, setSelectedCapacities] = useState<number[]>([]);
  const [sortType, setSortType] = useState('');
  
  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState<[Dayjs | null, Dayjs | null] | null>(null); // Track selected date range

  const fuelTypes: FilterOption[] = [
    { label: 'Petrol', count: 10 },
    { label: 'Diesel', count: 16 },
    { label: 'EV', count: 16 },
  ];

  const transmissionTypes: FilterOption[] = [
    { label: 'Automatic', count: 10 },
    { label: 'Manual', count: 16 },
  ];

  const capacities: FilterOption[] = [
    { label: '2 Person', count: 10 },
    { label: '4 Person', count: 14 },
    { label: '6 Person', count: 12 },
    { label: '8 or More', count: 16 },
  ];

  const handleCheckboxChange = (
    option: string,
    isChecked: boolean,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(prev => 
      isChecked 
        ? [...prev, option]
        : prev.filter(item => item !== option)
    );
  };

  const handleCapacityChange = (option: string, isChecked: boolean) => {
    const capacityValue = parseInt(option.split(' ')[0], 10);

    setSelectedCapacities(prev => 
      isChecked 
        ? [...prev, capacityValue]
        : prev.filter(item => item !== capacityValue)
    );
  };

  const handlePriceChange = (value: number | number[]) => {
    if (typeof value === 'number') {
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
  };

  const sortAscending = () => {
    setSortType("ascending");
  };

  const sortDescending = () => {
    setSortType("descending");
  };

  // Date Picker change handler
  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null, dateStrings: [string, string]) => {
    setSelectedDates(dates);
  };

  // Modal handlers
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Set proper data to the corresponding fields
  useEffect(() => {
    setMaxPrice(price);
    setFuelType(selectedFuelTypes);
    setTransmission(selectedTransmission);
    setCapacities(selectedCapacities);
    setSortingType(sortType);
  }, [price, selectedFuelTypes, selectedTransmission, selectedCapacities, sortType]);

  return (
    <div className={styles.filterMenu}>
      {/* Filter sections for Fuel Type, Transmission, Capacity, etc */}
      
      <div className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>FUEL TYPE</h3>
        {fuelTypes.map((option) => (
          <label key={option.label} className={styles.filterOption}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedFuelTypes.includes(option.label)}
              onChange={(e) => handleCheckboxChange(option.label, e.target.checked, setSelectedFuelTypes)}
            />
            <span className={styles.optionLabel}>{option.label}</span>
            <span className={styles.optionCount}>({option.count})</span>
          </label>
        ))}
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>TRANSMISSION</h3>
        {transmissionTypes.map((option) => (
          <label key={option.label} className={styles.filterOption}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedTransmission.includes(option.label)}
              onChange={(e) => handleCheckboxChange(option.label, e.target.checked, setSelectedTransmission)}
            />
            <span className={styles.optionLabel}>{option.label}</span>
            <span className={styles.optionCount}>({option.count})</span>
          </label>
        ))}
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>CAPACITY</h3>
        {capacities.map((option) => (
          <label key={option.label} className={styles.filterOption}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedCapacities.includes(parseInt(option.label.split(' ')[0], 10))}
              onChange={(e) => handleCapacityChange(option.label, e.target.checked)}
            />
            <span className={styles.optionLabel}>{option.label}</span>
            <span className={styles.optionCount}>({option.count})</span>
          </label>
        ))}
      </div>

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
          <button className={styles.sortButton} onClick={sortAscending}><i className="ri-sort-asc"></i></button>
          <button className={styles.sortButton} onClick={sortDescending}><i className="ri-sort-desc"></i></button>
        </div>
      </div>

      {/* Button for date change */}
      <div className={styles.filterSection}>
        <button className={styles.dateButton} onClick={showModal}>Change Dates</button>
      </div>

      {/* Modal for changing dates */}
      <Modal title="Change Dates" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <DatePicker.RangePicker onChange={handleDateChange} />
      </Modal>

      <button className={styles.clearButton} onClick={handleClearSelections}>Clear All Selections</button>
    </div>
  );
};

export default Filteration;
