import React from "react";
import styles from "./hero-card.module.css";
import ButtonComponent from "@/themes/button-component/button-component";

const HeroCard = () => {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroDescription}>
        <div>
          <h2>
            Find the Perfect Car for{" "}
            <span style={{ color: "#F97316" }}>Your Trip.</span>
          </h2>
          <p>
            Quick, easy, and at the best price. Whether you're planning a
            weekend getaway or a cross-country adventure, our diverse fleet and
            exceptional service ensure you get on the road effortlessly.
          </p>
          <div className={styles.redirectingButtons}>
            <ButtonComponent value="Get Started" className={styles.getStarted} />
            <button className={styles.downloadAppButton}>
              <span className={styles.downloadApp}>
                <img src="icons/download.svg" alt="" />
              </span>
              Download App
            </button>
          </div>
        </div>

        <div className={styles.storeLinks}>
          <button>
            <img src="icons/app-store.svg" alt="" />
            <div>
              <p>Download On the</p>
              <h3>App Store</h3>
            </div>
          </button>

          <button>
            <img src="icons/play-store.svg" alt="" />
            <div>
              <p>Download On the</p>
              <h3>Play Store</h3>
            </div>
          </button>
        </div>
      </div>

      <img src="images/hero-image.svg" alt="" className={styles.banner}/>
    </div>
  );
};

export default HeroCard;
