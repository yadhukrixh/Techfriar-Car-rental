import React from "react";
import styles from "./footer-list.module.css";

const FooterList = () => {
  return (
    <div className={styles.footerListWrapper}>
      <div className={styles.company}>
        <h2>Rentalia</h2>
        <ul>
          <li>
            <a href="#">About Us</a>
          </li>
          <li>
            <a href="#">Vehicles</a>
          </li>
          <li>
            <a href="#">Features</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
      </div>

      <div className={styles.appDownload}>
        <h2>Our Mobile App</h2>
        <div className={styles.storeLinks}>
          <button>
            <img src="icons/app-store-inverted.svg" alt="" />
            <div>
              <p>Download On the</p>
              <h3>App Store</h3>
            </div>
          </button>

          <button>
            <img src="icons/play-store-inverted.svg" alt="" />
            <div>
              <p>Download On the</p>
              <h3>Play Store</h3>
            </div>
          </button>
        </div>
      </div>

      <div className={styles.socials}>
        <h2>Connect with us</h2>
        <ul>
            <li>
                <a href="#"><img src="/icons/facebook-white.svg" alt="" /></a>
            </li>
            <li>
                <a href="#"><img src="/icons/twitter-white.svg" alt="" /></a>
            </li>
            <li>
                <a href="#"><img src="/icons/instagram-white.svg" alt="" /></a>
            </li>
            <li>
                <a href="#"><img src="/icons/linkd-in-white.svg" alt="" /></a>
            </li>
        </ul>
      </div>
    </div>
  );
};

export default FooterList;
