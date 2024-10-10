import BackButton from '@/themes/back-button/back-button';
import ButtonComponent from '@/themes/button-component/button-component';
import React from 'react';
import styles from './brands-header.module.css'

const BrandsHeader = () => {
  return (
    <div className={styles.brandHeaderWrapper}>
        <BackButton />
        <h2>Manage Brand</h2>
        <ButtonComponent value='Add Brand'  className={styles.addBrand} onClickFunction={()=>{
            window.location.href = "/admin/dashboard/brands/add"
        }}/>
    </div>
  )
}

export default BrandsHeader
