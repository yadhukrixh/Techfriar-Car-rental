import React, { useState } from "react";
import styles from "./index.module.css";

const AdminNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the navbar open/close state
  const toggleNavBar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.navBarWrapper} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.navHeader}>
      {isOpen && <h2>Rentalia</h2> }
        <h2 onClick={toggleNavBar} style={isOpen?{}:{padding:"0", justifyContent:"center", width:"100%"}}>
          <i className={isOpen ? "ri-close-large-fill" : "ri-menu-line"}></i>
        </h2>
      </div>

      <div className={styles.navList}>
        <ul style={isOpen?{}:{padding:"0", justifyContent:"center", width:"100%"}}>
          <li style={isOpen?{}:{padding:"0", justifyContent:"center", width:"100%"}}>
            <span className={styles.listLogos}>
              <i className="ri-home-4-fill"></i>
            </span>
            {isOpen && <p className={styles.listLabel}>Home</p>}
          </li>

          <li style={isOpen?{}:{padding:"0", justifyContent:"center", width:"100%"}}>
            <span className={styles.listLogos}>
              <i className="ri-car-fill"></i>
            </span>
            {isOpen && <p className={styles.listLabel}>Cars</p>}
          </li>

          <li style={isOpen?{}:{padding:"0", justifyContent:"center", width:"100%"}}>
            <span className={styles.listLogos}>
              <i className="ri-community-fill"></i>
            </span>
            {isOpen && <p className={styles.listLabel}>Brands</p>}
          </li>

          <li style={isOpen?{}:{padding:"0", justifyContent:"center", width:"100%"}}>
            <span className={styles.listLogos}>
              <i className="ri-logout-box-fill"></i>
            </span>
            {isOpen && <p className={styles.listLabel}>Logout</p>}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminNavBar;
