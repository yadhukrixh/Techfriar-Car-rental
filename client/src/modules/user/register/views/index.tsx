import React from 'react';
import ThreeStepRegistration from '../components/registration-form/registration-form';
import styles from "./registration.module.css";

const Registration = () => {
  return (
    <div className={styles.registrationWrapper}>
        <ThreeStepRegistration />
    </div>
  )
}

export default Registration
