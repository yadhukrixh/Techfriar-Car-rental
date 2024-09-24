import React, { FC } from 'react';
import styles from './button-component.module.css';
import clsx from 'clsx'; // For combining classNames

/**
 * Interface for ButtonProps
 * @interface ButtonProps
 * @property {string} value - The text to be displayed on the button
 * @property {string} [className] - Optional CSS class to be applied to the button
 * @property {boolean} [disabled] - Optional flag to disable the button
 * @property {function} [onClickFunction] - Optional function to be called on button click
 */
interface ButtonProps {
    value: string;
    className?: string;  // Allow any className string
    disabled?: boolean;
    onClickFunction?: () => void;
}

/**
 * ButtonComponent
 * @param {ButtonProps} props - The props for the button
 * @returns {JSX.Element} The customizable button component
 */
const ButtonComponent: FC<ButtonProps> = ({ value, className, onClickFunction, disabled }) => {
  return (
    <div className={styles.buttonMainClass}>
      {/* Combine default styles with parent-passed className */}
      <button
        className={clsx(styles.customButton, className)}  // Combine default class and the custom one
        onClick={onClickFunction}
        disabled={disabled}
      >
        {value}
      </button>
    </div>
  );
};

// Export the ButtonComponent
export default ButtonComponent;
