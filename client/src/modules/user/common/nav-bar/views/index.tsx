import React from 'react';
import AuthButtons from '../components/auth-buttons/auth-buttons';
import NavList from '../components/nav-list/nav-list';
import styles from './index.module.css'
import Logo from '../components/logo/logo';

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
