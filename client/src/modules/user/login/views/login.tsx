"use client";
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import styles from './login.module.css';
import { ApolloClient, NormalizedCacheObject, useApolloClient } from "@apollo/client";
import { LoginClass } from '../services/login-services';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const loginClass = new LoginClass(client);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const loginRequired = searchParams.get('loginRequired'); // Get 'loginRequired' parameter

    if (loginRequired) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please login to rent a car",
      }).then(() => {
        router.replace('/login'); // Clean up URL after showing the alert
      });
    }
  }, [router, searchParams]);

  const onFinish = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await loginClass.loginUser(form.getFieldValue("phoneNumber"), form.getFieldValue("password"));
      // Add navigation logic here if needed
    } catch {
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
