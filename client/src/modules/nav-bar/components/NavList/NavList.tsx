import React from 'react';
import styles from './NavList.module.css';

const NavList = () => {
  return (
    <div className={styles.navListWarapper}>
    <ul className={styles.navList}>
        <li>
            <a href="#">Home</a>
            <span className={styles.underLine}></span>
        </li>
        <li>
            <a href="#">Vehicles</a>
            <span className={styles.underLine}></span>
        </li>
        <li>
            <a href="#">Features</a>
            <span className={styles.underLine}></span>
        </li>
        <li>
            <a href="#">Contact</a>
            <span className={styles.underLine}></span>
        </li>
    </ul>
    </div>
  )
}

export default NavList
