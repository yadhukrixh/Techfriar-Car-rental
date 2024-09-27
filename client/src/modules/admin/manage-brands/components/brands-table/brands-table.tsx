import React from 'react'
import styles from './brands-table.module.css'
import { BrandTableProps } from '@/interfaces/popular-brands';




  const BrandsTable: React.FC<BrandTableProps> = ({ brands, onEdit, onDelete }) => {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.brandTable}>
          <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Country</th>
              <th>Number of Cars</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td>
                  <img src={brand.logoUrl} alt={`${brand.name} logo`} className={styles.logo} />
                </td>
                <td>{brand.name}</td>
                <td>{brand.country}</td>
                <td>{brand.numberOfCars}</td>
                <td className={styles.actions}>
                  <button><i className="ri-edit-2-fill"></i></button>
                  <button><i className="ri-delete-bin-fill"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default BrandsTable
