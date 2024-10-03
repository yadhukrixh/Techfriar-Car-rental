import React from 'react';
import { InputNumber, Button } from 'antd';
import styles from './quantity-selector.module.css';

interface QuantitySelectorProps {
  minimum:number;
  quantity: number;
  setQuantity: (value: number) => void; // expects number only
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ minimum , quantity, setQuantity }) => {
  const handleIncrement = () => {
    setQuantity(quantity ? quantity + 1 : quantity);
  };

  const handleDecrement = () => {
    setQuantity(quantity && quantity >minimum ? quantity - 1 : quantity);
  };

  const handleChange = (value: number | null) => {
    if (value !== null) {
      setQuantity(value); // Only setQuantity if value is not null
    }
  };

  return (
    <div className={styles.quantitySelector}>
      <Button onClick={handleDecrement} disabled={!quantity || quantity <= minimum} style={{color:"black"}}>
        -
      </Button>
      <InputNumber
        min={minimum}
        value={quantity}
        onChange={handleChange} // Use handleChange to handle null
        className={styles.numberSelectorInput}
        style={{ width: '60px', margin: '0 8px' }}
        type='number'
        readOnly={true}
      />
      <Button onClick={handleIncrement}>+</Button>
    </div>
  );
};

export default QuantitySelector;
