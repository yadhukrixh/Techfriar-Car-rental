import React from 'react';
import styles from './filteration-botton.module.css';

const FilterationButton = () => {
  return (
    <div>
      <button className={styles.filterButton}>
      <i className="ri-equalizer-3-line"></i>
      </button>
    </div>
  )
}

export default FilterationButton;
