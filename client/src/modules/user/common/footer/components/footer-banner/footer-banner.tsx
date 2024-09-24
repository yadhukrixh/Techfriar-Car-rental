import React from "react";
import styles from "./footer-banner.module.css";
import ButtonComponent from "@/themes/button-component/button-component";

const FooterBanner = () => {
  return (
    <div className={styles.footerBannerWrapper}>
      <div className={styles.bannerDescription}>
        <h2>Ready to Start Your Journey?</h2>
        <p>
          Explore our extensive car rental options and find the perfect
          companion for your next adventure. With a wide range of vehicles and
          exceptional customer service.
        </p>
        <ButtonComponent value="Get Started" className={styles.getStartedButton}/>
      </div>
    </div>
  );
};

export default FooterBanner;
