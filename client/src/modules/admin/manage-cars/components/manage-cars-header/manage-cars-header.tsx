import React from 'react';
import styles from './manage-cars-header.module.css';
import BackButton from '@/themes/back-button/back-button';
import ButtonComponent from '@/themes/button-component/button-component';

const ManageCarsHeader = () => {
  return (
    <div className={styles.manageCarsHeaderWrapper}>
      <BackButton />
      <h2>Manage Cars</h2>
      <ButtonComponent value='Add Cars' className={styles.addCarButton} onClickFunction={()=>{
        window.location.href = "/admin/dashboard/cars/add"
      }}/>
    </div>
  )
}

export default ManageCarsHeader
