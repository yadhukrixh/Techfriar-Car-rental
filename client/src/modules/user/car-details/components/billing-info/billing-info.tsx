import React, { useState } from 'react';
import { Form, Input, Radio, Button, Modal } from 'antd';
import styles from './billing-info.module.css';
import MapComponent from '@/modules/user/cars/components/map/location-picker';
import { LatLngTuple } from 'leaflet';
import { UserData } from '@/interfaces/user/user-details';
import { ApolloClient, NormalizedCacheObject, useApolloClient } from '@apollo/client';
import { CarBookingServices } from '../../services/car-booking-services';

interface BillingFormProps {
  userData: UserData;
  dates?: Date[];
  carModelId:number | undefined;
  amount:Number | undefined;
  setShowPayment:(status:boolean)=>void;
  setBookingId:(id:number)=>void;
  setShowBilling:(status:boolean)=>void;
}

export default function BillingForm({ userData, dates, carModelId , amount, setShowPayment,setBookingId,setShowBilling}: BillingFormProps) {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const carBookingService = new CarBookingServices(client);
  const [returnLocationType, setReturnLocationType] = useState<'delivery' | 'company' | 'custom'>('delivery');
  const [customReturnLocation, setCustomReturnLocation] = useState<LatLngTuple | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const [loading,setLoading] = useState(false)
  const location = params.get('location');

  const handleSubmit = async(values: any) => {
    const returnLocation =
      returnLocationType === 'custom' ? customReturnLocation?.toString() : 
      returnLocationType === 'delivery' ? location?.toString() : 'company';

      setLoading(true)
      await carBookingService.createBooking(userData.id,dates,carModelId,location,returnLocation,values.secondaryMobile,amount,setShowPayment,setBookingId);
      setLoading(false)
    
  };

  const handleLocationSelect = (value: string) => {
    setReturnLocationType(value as 'delivery' | 'company' | 'custom');
    if (value === 'custom') {
      setIsModalVisible(true);
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleBack = () =>{
    setShowBilling(false);
  }

  return (
    <Form className={styles.billingForm} onFinish={handleSubmit} layout="vertical">
      <div className={styles.section}>
        <h2>User Information</h2>
        <div className={styles.readOnlyField}>
          <label>Name:</label>
          <span>{userData?.name || 'N/A'}</span>
        </div>
        <div className={styles.readOnlyField}>
          <label>Primary Mobile:</label>
          <span>{userData.phoneNumber}</span>
        </div>
        <div className={styles.readOnlyField}>
          <label>Booked Dates:</label>
          <span>
            {dates && dates.length > 0 
              ? `${dates[0]?.toISOString().split('T')[0]} to ${dates[dates.length - 1]?.toISOString().split('T')[0]}` 
              : 'N/A'}
          </span>
        </div>
        <button className={styles.locationButton} onClick={() => {
          window.open(`https://www.google.com/maps/place/${location}`, '_blank');
        }} type='button'><i className="ri-eye-line"></i> Delivery Location</button>
      </div>

      <div className={styles.section}>
        <h2>Additional Information</h2>

        <Form.Item
          name="secondaryMobile"
          label="Secondary Mobile Number"
          rules={[
            { required: true, message: 'Please input your secondary mobile number!' },
            { pattern: /^\d{10}$/, message: 'Mobile number should be exactly 10 digits.' },
            // Custom validation rule to check if secondary number matches primary number
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value !== userData.phoneNumber) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Secondary mobile number cannot be the same as primary mobile number.'));
              },
            }),
          ]}
        >
          <Input type="tel" maxLength={10} />
        </Form.Item>

        <div className={styles.returnLocationSection}>
          <h3>Return Location</h3>
          <Form.Item>
            <Radio.Group
              value={returnLocationType}
              onChange={(e) => handleLocationSelect(e.target.value)}
            >
              <Radio value="delivery">Same as Delivery</Radio>
              <Radio value="company">At Company</Radio>
              <Radio value="custom">Custom Location</Radio>
            </Radio.Group>
            {customReturnLocation &&
                <button onClick={() => { setIsModalVisible(true); }} className={styles.locationButton} type='button'><i className="ri-edit-2-line"></i> Return Locaion</button>
            }
          </Form.Item>
        </div>

        <Modal
          title="Select Custom Return Location"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        >
          <MapComponent location={customReturnLocation} setLocation={setCustomReturnLocation} />
        </Modal>

        <Form.Item>
          <Button type="primary" htmlType="submit"  loading={loading} className={styles.submitButton}>
            Submit
          </Button>
          <Button onClick={handleBack}  loading={loading} className={styles.cancelButton}>
            Cancel
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
}
