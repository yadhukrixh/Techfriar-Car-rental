"use client";

import React, { useState } from "react";
import styles from './SelectorComponent.module.css'; // Assume you're using CSS Modules

interface CustomSelectorProps {
  options: any[];
  placeholder: string;
  className?:string;
  setSelectedValue: (value: any) => void;
}

const SelectorComponent: React.FC<CustomSelectorProps> = ({
  options,
  placeholder,
  className,
  setSelectedValue
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);
    setSelectedValue(value); // Send the selected value to the parent component
  };



  return (
    <div className={styles.selectWrapper}>
      <select value={selectedOption} onChange={handleChange} 
        className={className?styles[className]:styles.selectBox}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectorComponent;
