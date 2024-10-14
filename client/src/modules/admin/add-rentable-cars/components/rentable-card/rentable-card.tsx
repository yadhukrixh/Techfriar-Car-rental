import React, { useState } from 'react';
import { Card, Switch, Button, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './rentable-card.module.css';
import { ApolloClient, NormalizedCacheObject, useApolloClient } from '@apollo/client';
import { AddRentablecars } from '../../services/add-rentable-cars-service';

interface Car {
  id: string | number;
  registrationNumber: string;
  activeStatus: boolean;
}

interface CarCardProps {
  car: Car;
  loading: boolean;
  setLoading: (status:boolean)=>void;
}

const RentableCard: React.FC<CarCardProps> = ({ 
  car, 
  loading,
  setLoading
}) => {

  const [activeStatus,setActiveStatus] = useState<boolean>(car.activeStatus);
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const addRentableCars = new AddRentablecars(client);

  // Handle status change
  const handleStatusChange = async (checked: boolean, carId: string | number) => {
    try {
      setLoading(true);
      console.log(checked)
      message.success("Status updated successfully");
      setActiveStatus(!activeStatus);
    } catch (error) {
      message.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <Card className={styles.carCard}>
      <div className={styles.carCardContent}>
        <span className={styles.registrationNumber}>
          {car.registrationNumber}
        </span>
        <div className={styles.cardActions}>
          <Switch
            checked={activeStatus}
            onChange={(checked: boolean) => handleStatusChange(checked, car.id)}
            disabled={loading}
          />
          <Button
            icon={<EditOutlined />}
            type="text"
            disabled={loading}
            // onClick={() => onEdit && onEdit(car.id)}
          />
          <Button
            icon={<DeleteOutlined />}
            type="text"
            danger
            // onClick={() => onDelete(car.id)}
            disabled={loading}
          />
        </div>
      </div>
    </Card>
  );
};

export default RentableCard;