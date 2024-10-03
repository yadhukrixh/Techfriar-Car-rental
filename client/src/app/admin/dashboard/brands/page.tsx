import ManageBrands from '@/modules/admin/manage-brands/views'
import React from 'react'
import styles from './brands.module.css';
const page = () => {
  return (
    <div className={styles.manageBrandsWrapper}>
      <ManageBrands />
    </div>
  )
}

export default page
