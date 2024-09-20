

import React, {FC} from 'react';
import styles from './ButtonComponent.module.css';



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
    className?:keyof typeof styles;
    disabled?:boolean;
    onClickFunction ?: () => void;
};

/**
 * CustomizableButton component
 * @param {ButtonProps} props - The props for the button
 * @returns {JSX.Element} The customizable button component
 */
const ButtonComponent: FC<ButtonProps> = ({value, className , onClickFunction,disabled}) => {

  return (
    // Main container for the button
    <div className={styles.buttonMainClass}>
      {/* The customizable button */}
      <button 
        // Apply the optional CSS class
        className={className?styles[className]:styles.customButton} 
        // Call the optional onClick function
        onClick={onClickFunction} 
        // Disable the button if disabled prop is true
        disabled={disabled}>
      {value} 
      </button>
    </div>
  )
}

// Export the CustomizableButton component as default
export default ButtonComponent;