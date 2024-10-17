"use client";
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import styles from './login.module.css';
import { ApolloClient, NormalizedCacheObject, useApolloClient } from "@apollo/client";
import { LoginClass } from '../services/login-services';

const LoginPage = () => {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const loginClass = new LoginClass(client);

  const onFinish = async (values: { phoneNumber: string; password: string }) => {
    setLoading(true);
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      await loginClass.loginUser(form.getFieldValue("phoneNumber"),form.getFieldValue("password"))
      // You can add navigation logic here
    } catch (error) {
      message.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className={styles.form}
      >
        <h2>Login</h2>
        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[
            { required: true, message: 'Please input your phone number!' },
            { pattern: /^\d{10}$/, message: 'Phone number must be 10 digits!' }
          ]}
        >
          <Input type='number' />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className={styles.submitButton}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;