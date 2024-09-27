
import React from 'react';
import styles from './back-button.module.css'; // Import the CSS module

const BackButton: React.FC = () => {


  // Function to go back to the previous page
  const goBack = () => {
    window.history.back();
  };
  

  return (
    <button onClick={goBack} className={styles.backButton}>
      <i className="ri-arrow-left-line"></i>
    </button>
  );
};

export default BackButton;
