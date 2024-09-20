import React from 'react';
import AuthButtons from '../components/AuthButtons/AuthButtons';
import NavList from '../components/NavList/NavList';
import styles from './index.module.css'
import Logo from '../components/Logo/Logo';

const NavBar = () => {
  return (
    <div className={styles.navBarWrapper}>
      <Logo />
      <NavList />
      <AuthButtons />
    </div>
  )
}

export default NavBar;
