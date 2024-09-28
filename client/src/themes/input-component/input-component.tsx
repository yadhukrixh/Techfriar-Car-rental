import React, { FC, ChangeEvent } from 'react';
import styles from './input-component.module.css';

/**
 * Interface for InputSectionProps
 * 
 * @typedef {Object} InputSectionProps
 * @property {string} type - The type of input field (e.g., text, email, password)
 * @property {string} value - The current value of the input field
 * @property {function} onChange - A callback function to handle changes to the input field
 * @property {string} [placeholder] - An optional placeholder text for the input field
 * @property {keyof typeof styles} [customClassName] - An optional custom class name for the input field
 * @property {boolean} [editableStatus] - An optional flag to indicate if the input field is editable
 * @property {boolean} [toUppercase] - An optional flag to convert the input value to uppercase
 */
interface InputSectionProps {
  type: string;
  value: any;
  onChange: (value:any) => void;
  placeholder?: string;
  customClassName?: keyof typeof styles; // Ensure this matches a key in `styles`
  editableStatus?: boolean;
  toUppercase?: boolean;
  acceptType?:string;
}

/**
 * InputComponent: A reusable input field component
 * 
 * @param {InputSectionProps} props - The component props
 * @returns {JSX.Element} The input field component
 */
const InputComponent: FC<InputSectionProps> = ({
  type,
  value,
  onChange,
  placeholder,
  customClassName,
  editableStatus,
  toUppercase,
  acceptType
}) => {
  /**
   * Handle changes to the input field
   * 
   * @param {ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (toUppercase) {
      // Convert the input value to uppercase if toUppercase is true
      const upperCaseValue = e.target.value.toUpperCase();
      onChange(upperCaseValue);
    } else {
      // Otherwise, pass the original value to the onChange callback
      onChange(e.target.value);
    }
  };

  return (
    // The main container for the input field
    <div className={styles.main}>
      <input
        // The type of input field
        type={type}
        // The current value of the input field
        value={value}
        // Handle changes to the input field
        onChange={handleChange}
        // Optional placeholder text
        placeholder={placeholder}
        // Apply a custom class name if provided
        className={customClassName ? styles[customClassName] : styles.CustomInput}
        // Make the input field required
        required
        // Make the input field read-only if editableStatus is false
        readOnly={editableStatus || false}
        // accept type
        accept={acceptType}
      />
    </div>
  );
};

export default InputComponent;