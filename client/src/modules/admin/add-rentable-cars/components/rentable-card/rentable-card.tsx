import React, { useState } from 'react';
import { Card, Switch, Button, message, Modal, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './rentable-card.module.css';
import { ApolloClient, NormalizedCacheObject, useApolloClient } from '@apollo/client';
import { ManageRentablecars } from '../../services/add-rentable-cars-service';

interface Car {
  id: string | number;
  registrationNumber: string;
  activeStatus: boolean;
}

interface CarCardProps {
  car: Car;
  loading: boolean;
  setLoading: (status: boolean) => void;
}

const RentableCard: React.FC<CarCardProps> = ({ 
  car, 
  loading,
  setLoading
}) => {

  const [activeStatus, setActiveStatus] = useState<boolean>(car.activeStatus);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [newRegistrationNumber, setNewRegistrationNumber] = useState<string>(car.registrationNumber);
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const manageRentableCars = new ManageRentablecars(client);
  const id = parseInt((car.id).toString(), 10);

  // Handle status change
  const handleStatusChange = async (checked: boolean) => {
    try {
      setLoading(true);
      setActiveStatus(!activeStatus);
      await manageRentableCars.changeActiveStatus(id, checked);
    } catch{
      message.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  // Show modal to edit registration number
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal OK button
  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      // Here you can send the updated registration number to the server.
      await manageRentableCars.editRegistrationNumber(id,newRegistrationNumber)
      setIsModalVisible(false);
    } catch {
      message.error("Failed to update registration number");
    } finally {
      setLoading(false);
    }
  };

  // Handle modal Cancel button
  const handleCancel = () => {
    setIsModalVisible(false);
    setNewRegistrationNumber(car.registrationNumber); // Reset to the original value
  };

  return (
    <>
      <Card className={styles.carCard}>
        <div className={styles.carCardContent}>
          <span className={styles.registrationNumber}>
            {car.registrationNumber}
          </span>
          <div className={styles.cardActions}>
            <Switch
              checked={activeStatus}
              onChange={(checked: boolean) => handleStatusChange(checked)}
              disabled={loading}
            />
            <Button
              icon={<EditOutlined />}
              type="text"
              disabled={loading}
              onClick={showModal} // Show the modal on Edit click
            />
            <Button
              icon={<DeleteOutlined />}
              type="text"
              danger
              disabled={loading}
            />
          </div>
        </div>
      </Card>

      {/* Modal for editing registration number */}
      <Modal
        title="Edit Registration Number"
        visible={isModalVisible}
        onOk={handleSaveEdit}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Input
          value={newRegistrationNumber}
          onChange={(e) => {
            const regex = /^[A-Z]{0,2}\d{0,2}[A-Z]{0,2}\d{0,4}$/; // Regex for Indian vehicle registration format
            const inputValue = e.target.value
              .toUpperCase()
              .replace(/\s/g, ""); // Convert to uppercase and remove spaces

            if (regex.test(inputValue)) {
              setNewRegistrationNumber(inputValue); // Set value if it matches the regex
            }
          }}
          placeholder="Enter new registration number"
        />
      </Modal>
    </>
  );
};

export default RentableCard;
