"use client";
import React, { FC, useState } from 'react';
import { Table, Button, Space, Image } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './brands-table.module.css';
import { ColumnsType } from 'antd/es/table';
import { Brand } from '@/interfaces/brands';
import { ManageBrandsClass } from '../../services/manage-brands-services';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import EditBrand from '../edit-brand/edit-brand';



// Props interface for the BrandTable component
interface BrandTableProps {
  brandData: Brand[]; // An array of Brand objects
  client:ApolloClient<NormalizedCacheObject>;
}

const BrandTable:FC<BrandTableProps> = ({brandData,client}) => {
  
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null); // State for the selected brand
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const handleModalClose = () => {
    setIsModalVisible(false); // Close the modal
    setSelectedBrand(null); // Reset selected brand
  };


  const manageBrandsClass = new ManageBrandsClass(client);

  const columns: ColumnsType<Brand> = [
    {
      title: 'SI No',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: Brand, index: number) => index + 1, // Auto-increment SI No
      responsive: [ 'sm', 'md', 'lg'] as ( 'sm' | 'md' | 'lg')[],
    },
    {
      title: 'Logo',
      dataIndex: 'logoUrl', // Updated to match the Brand interface
      key: 'logoUrl',
      render: (logoUrl: string) => <Image width={50} src={logoUrl} alt="Brand Logo" />,
      responsive: [ 'sm', 'md', 'lg'] as ( 'sm' | 'md' | 'lg')[],
    },
    {
      title: 'Brand Name',
      dataIndex: 'name',
      key: 'name',
      responsive: ['xs', 'sm', 'md', 'lg'] as ('xs' | 'sm' | 'md' | 'lg')[],
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      responsive: ['sm', 'md', 'lg'] as ('sm' | 'md' | 'lg')[],
    },
    {
      title: 'No. of Vehicles',
      dataIndex: 'numberOfCars', // Ensure consistency with the Brand interface
      key: 'numberOfCars',
      responsive: ['md', 'lg'] as ('md' | 'lg')[],
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Brand) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className={styles.editButton}
          />
          <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            onClick={() => manageBrandsClass.deleteBrand(record.id)}
            className={styles.deleteButton}
          />
        </Space>
      ),
      responsive: ['xs', 'sm', 'md', 'lg'] as ('xs' | 'sm' | 'md' | 'lg')[],
    },
  ];

  // Edit action handler
  const handleEdit = (record: Brand) => {
    setSelectedBrand(record); // Set the selected brand
    setIsModalVisible(true); // Show the modal
  };

  



  // Map over the brand data to create the table rows
  const mappedBrandData = brandData.map((brand: Brand, index: number) => ({
    ...brand,
    key: brand.id, // Use the brand ID as the key for table row
  }));

  return (
    <div>
    <div className={styles.brandTable}>
      <Table
        columns={columns}
        dataSource={mappedBrandData} // Use mapped data here
        pagination={{ pageSize: 10 }}
        rowKey={(record) => record.id.toString()} // Ensure the rowKey is a string
        scroll={{ x: 500 }}
        className={styles.table}
      />
    </div>
    {selectedBrand && (
      <EditBrand visible={isModalVisible}
      onClose={handleModalClose}
      brand={selectedBrand}
      client={client}  />
    )}
    </div>
  );
};

export default BrandTable;
