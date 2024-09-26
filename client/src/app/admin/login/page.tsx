import AdminLoginForm from '@/modules/admin/login/views';
import React from 'react';
import styles from './admin-login.module.css';

const page = () => {
  return (
    <div className={styles.loginWrapper}>
      <AdminLoginForm />
    </div>
  )
}

export default page
