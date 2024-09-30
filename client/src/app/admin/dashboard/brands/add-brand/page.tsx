import AddBrand from '@/modules/admin/add-brand/views'
import styles from './add-brand.module.css';
import React from 'react'

const page = () => {
  return (
    <div className={styles.addBrandWrapper}>
      <AddBrand />
    </div>
  )
}

export default page
