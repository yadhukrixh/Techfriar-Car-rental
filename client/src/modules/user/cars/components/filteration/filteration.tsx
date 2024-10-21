"use client";
import React, { useState } from 'react';
import styles from './filteration.module.css';
import { Slider } from 'antd';

type FilterOption = {
  label: string;
  count: number;
};

const Filteration: React.FC = () => {
  const [price, setPrice] = useState<number>(100);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>([]);
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([]);

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

  const handlePriceChange = (value: number | number[]) => {
    if (typeof value === 'number') {
      setPrice(value);
    } else {
      setPrice(value[0]);
    }
  };

  return (
    <div className={styles.filterMenu}>
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
              checked={selectedCapacities.includes(option.label)}
              onChange={(e) => handleCheckboxChange(option.label, e.target.checked, setSelectedCapacities)}
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
            defaultValue={1000}
            max={10000}
            step={1}
            onChange={handlePriceChange}
          />
          <div className={styles.priceLabel}>Max. ₹{price}.00</div>
        </div>
      </div>
    </div>
  );
};

export default Filteration;