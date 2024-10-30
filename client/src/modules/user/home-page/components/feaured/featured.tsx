import React from 'react';
import styles from './featured.module.css';

const Featured = () => {
  return (
    <div className={styles.featureListWrapper}>
      <h2>We're BIG on what matters to you</h2>
      <div className={styles.featureGrid}>
        <div className={styles.featureCard}>
          <div className={styles.icon}><img src="/icons/Category.svg" alt="" /></div>
          <h3>Wide Selection</h3>
          <p>Our stress-free finance department that can find financial solutions to save you money.</p>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.icon}><img src="/icons/Wallet.svg" alt="" /></div>
          <h3>Transparent Pricing</h3>
          <p>Our stress-free finance department that can find financial solutions to save you money.</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.icon}><img src="/icons/Shield.svg" alt="" /></div>
          <h3>24/7 Support</h3>
          <p>Our stress-free finance department that can find financial solutions to save you money.</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.icon}><img src="/icons/Activity.svg" alt="" /></div>
          <h3>Easy and Fast</h3>
          <p>Our stress-free finance department that can find financial solutions to save you money.</p>
        </div>
      </div>
    </div>
  );
};

export default Featured;
