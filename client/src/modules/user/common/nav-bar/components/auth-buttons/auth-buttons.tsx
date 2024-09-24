import ButtonComponent from '@/themes/button-component/button-component';
import React from 'react';
import styles from './auth-buttons.module.css';

const AuthButtons = () => {
  return (
    <div className={styles.authWrapper}>
      <ButtonComponent value='Login' className={styles.loginButton} />
      <ButtonComponent value='Sign Up' className={styles.signUpButton} />
    </div>
  )
}

export default AuthButtons;
