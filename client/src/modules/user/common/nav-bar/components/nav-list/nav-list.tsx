import React from 'react';
import styles from './nav-list.module.css';

const NavList = () => {
  return (
    <div className={styles.navListWarapper}>
    <ul className={styles.navList}>
        <li>
            <a href="example.domain.com">Home</a>
            <span className={styles.underLine}></span>
        </li>
        <li>
            <a href="example.domain.com">Vehicles</a>
            <span className={styles.underLine}></span>
        </li>
        <li>
            <a href="example.domain.com">Features</a>
            <span className={styles.underLine}></span>
        </li>
        <li>
            <a href="example.domain.com">Contact</a>
            <span className={styles.underLine}></span>
        </li>
    </ul>
    </div>
  )
}

export default NavList
