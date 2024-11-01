"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Steps, message } from "antd";
import styles from "./registration.module.css";
import { UserData } from "@/interfaces/user/user-details";
import { HandleRegistration } from "../../services/registration-services";
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from "@apollo/client";

const { Option } = Select;
const { Step } = Steps;

const ThreeStepRegistration = () => {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm(); // Create form instance
  const handleRegistration = new HandleRegistration(client);
  const [otpSentStatus, setOtpSentStatus] = useState<boolean>(false);
  const [verifiedStatus,setVerifiedStatus] = useState<boolean>(false);

  useEffect(() => {
    const fetchDataFromLocalStorage = async () => {
      const storedData = localStorage.getItem("userData");
      if (storedData) {
        await handleRegistration.getFromLocalStorage(setFormData);
      }
    };
    fetchDataFromLocalStorage();
    
  }, []); // Empty dependency array ensures it runs once on mount

  useEffect(() => {
    console.log("Form data has changed:", formData);
  }, [formData]); // Run only when formData changes

  const onFinish = async () => {
    if(verifiedStatus){
      await handleRegistration.registerUser(formData);
    }else{
      message.error("Phone number hasn't been verified yet!")
    }
  };

  const nextStep = async () => {
    try {
      // Validate the form before moving to the next step
      const values = await form.validateFields();
      setFormData((prev) => ({ ...prev, ...values })); // Update formData with validated values
      setCurrentStep((prevStep) => prevStep + 1);
      await handleRegistration.saveToLocalStorage(formData);
    } catch (errorInfo) {
      console.log('Validation Failed:', errorInfo);
      // Optionally show a message or handle UI feedback for validation failure
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // send otp to phone number
  const sendOtpToPhone = async (number: string) => {
    await handleRegistration.sendOtpToPhoneNumber(number, setOtpSentStatus);
  };

  // verify otp 
  const verifyOtp = async (otp:string) => {
    await handleRegistration.verifyOtp(otp,setVerifiedStatus,formData.phoneNumber?formData.phoneNumber:"")
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <h3>Basic Information</h3>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                value={formData.name}
              />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email", message: "Please input a valid email!" }]}
            >
              <Input
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                }}
                defaultValue={formData.email}
              />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true, message: "Please input your phone number!" }]}
            >
              <Input
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }));
                  setVerifiedStatus(false);
                }}
                value={formData.phoneNumber}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                value={formData.password}
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("The two passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                value={formData.confirmPassword}
              />
            </Form.Item>
          </>
        );
      case 1:
        return (
          <>
            <h3>Additional Information</h3>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please input your city!" }]}
            >
              <Input
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
                value={formData.city}
              />
            </Form.Item>
            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "Please input your state!" }]}
            >
              <Input
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, state: e.target.value }))
                }
                value={formData.state}
              />
            </Form.Item>
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: "Please select your country!" }]}
            >
              <Select
                placeholder="Select your country"
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, country: value }))
                }
              >
                <Option value="usa">United States</Option>
                <Option value="uk">United Kingdom</Option>
                <Option value="canada">Canada</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="pincode"
              label="PIN Code"
              rules={[
                { required: true, message: "Please input your PIN code!" },
                { pattern: /^\d{6}$/, message: "PIN code must be 6 digits!" },
              ]}
            >
              <Input
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, pincode: e.target.value }))
                }
                value={formData.pincode}
              />
            </Form.Item>
          </>
        );
      case 2:
        return (
          <>
            <h3>Verify Credentials</h3>
            <Form.Item
              name="phoneVerificationCode"
              label="Phone Verification Code"
              extra={`A code will be sent to ${formData.phoneNumber}`}
              rules={[
                { required: true, message: "Please input the phone verification code!" },
                { len: 6, message: "The verification code must be exactly 6 digits!" },
              ]}
            >
              <div className={styles.inputGroup}>
                <Input
                  type="number"
                  maxLength={6} // Limit input to 6 characters
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      otp: e.target.value,
                    }))
                    
                  }
                />
                <Button
                  danger
                  type="text"
                  onClick={() => {
                    if(otpSentStatus){
                      verifyOtp(formData.otp?formData.otp:"")
                    }else{
                      sendOtpToPhone(formData.phoneNumber?formData.phoneNumber:"")
                    }
                  }}
                  className={styles.sendOtp}
                >
                  {otpSentStatus ? "Verify Otp" : "Send Otp"}
                </Button>
              </div>
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <Steps current={currentStep} className={styles.steps}>
        <Step title="Basic Info" />
        <Step title="Additional Info" />
        <Step title="Verify" />
      </Steps>
      <Form
        form={form} // Pass the form instance here
        layout="vertical"
        onFinish={onFinish} // Handles form submission
      >
        {renderStepContent()}
        <div className={styles.buttonContainer}>
          {currentStep > 0 && (
            <Button onClick={prevStep}>Previous</Button>
          )}
          {currentStep < 2 && (
            <Button type="primary" onClick={nextStep}>
              Next
            </Button>
          )}
          {currentStep === 2 && (
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default ThreeStepRegistration;
