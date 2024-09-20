import ButtonComponent from '@/themes/ButtonComponent/ButtonComponent';
import React from 'react';
import styles from './AuthButtons.module.css';

const AuthButtons = () => {
  return (
    <div className={styles.authWrapper}>
      <ButtonComponent value='Login' className='loginButton' />
      <ButtonComponent value='Sign Up' className='signUpButton' />
    </div>
  )
}

export default AuthButtons;
