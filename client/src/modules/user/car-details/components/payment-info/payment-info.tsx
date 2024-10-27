import React, { useState } from 'react';
import { Radio, Checkbox, Button, Card, Alert, Space, Typography } from 'antd';
import type { RadioChangeEvent } from 'antd/es/radio';
import { InfoCircleOutlined } from '@ant-design/icons';
import styles from './payment-info.module.css';

const { Title } = Typography;

interface PaymentProps {
  amount: number | undefined; // Use number instead of Number
  setShowPaymentInfo:(status:boolean)=>void;
  handlePayment:(amount:number | undefined)=>void;
}

const PaymentInfo: React.FC<PaymentProps> = ({ amount, setShowPaymentInfo,handlePayment }) => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [consent, setConsent] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const paymentMethods = [
    { id: 'paypal', name: 'PayPal', disabled: true, logo: '/icons/PayPal.png' },
    { id: 'razorpay', name: 'Razorpay', disabled: false, logo: '/icons/Razorpay_logo.png' },
    { id: 'payOnDelivery', name: 'Pay on Delivery', disabled: true, logo: null },
  ];

  const handlePaymentChange = (e: RadioChangeEvent) => {
    const method = paymentMethods.find((m) => m.id === e.target.value);
    if (method?.disabled) {
      setError(`${method.name} is currently not supported as a payment method.`);
      setSelectedPayment(null);
    } else {
      setError(null);
      setSelectedPayment(e.target.value);
    }
  };

  const handlePay = () => {
    if (!selectedPayment && !consent) {
      setError('Please select a payment method and accept the terms and conditions.');
    } else if (!selectedPayment) {
      setError('Please select a payment method.');
    } else if (!consent) {
      setError('Please accept the terms and conditions.');
    } else {
      setError(null);
      console.log('Payment processed with:', selectedPayment);
      handlePayment(amount)
    }
  };

  const handleCancel = () => {
    setShowPaymentInfo(false);
  }

  return (
    <Card className={styles.container}>
      <Title level={3} className={styles.title}>
        Amount to Pay: {amount !== undefined ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(amount) : 'N/A'}
      </Title>

      <Space direction="vertical" size="large" className={styles.content}>
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            icon={<InfoCircleOutlined />}
          />
        )}

        <h3>Select Payment Option:</h3>

        <Radio.Group
          onChange={handlePaymentChange}
          value={selectedPayment}
          className={styles.radioGroup}
        >
          <Space direction="vertical" className={styles.radioSpace}>
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`${styles.paymentOption} ${
                  method.disabled ? styles.disabled : ''
                } ${selectedPayment === method.id ? styles.selected : ''}`}
              >
                <Radio
                  value={method.id}
                  disabled={method.disabled}
                  className={styles.radio}
                >
                  {method.logo ? (
                    <img
                      src={method.logo}
                      alt={method.name}
                      className={styles.paymentLogo}
                    />
                  ) : (
                    <span className={styles.paymentText}>{method.name}</span>
                  )}
                </Radio>
              </div>
            ))}
          </Space>
        </Radio.Group>

        <div className={styles.consentContainer}>
          <Checkbox
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          >
            <span className={styles.consentText}>
              I agree to the terms and conditions
            </span>
          </Checkbox>
        </div>

        <Button
          type="primary"
          onClick={handlePay}
          disabled={!selectedPayment || !consent}
          className={styles.payButton}
          block
        >
          Pay Now
        </Button>

        <Button
          type="primary"
          className={styles.cancelButton}
          onClick={handleCancel}
          block
        >
          Cancel
        </Button>
      </Space>
    </Card>
  );
};

export default PaymentInfo;
