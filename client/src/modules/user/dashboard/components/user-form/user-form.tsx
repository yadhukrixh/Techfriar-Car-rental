"use client";
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Tooltip,
  Tabs,
  Card,
  Avatar,
  Row,
  Col,
  UploadFile,
} from "antd";
import {
  UserOutlined,
  CameraOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  LockOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import styles from "./user-form.module.css";
import { UserData } from "@/interfaces/user/user-details";
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from "@apollo/client";
import { UserServices } from "../../services/user-services";
import { OrderData } from "@/interfaces/user/orders";
import OrderHistory from "../order-history/order-history";

const { TabPane } = Tabs;

const UserProfile = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData | undefined>(undefined); // Change to allow null
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [orderHistory, setOrderHistory] = useState<OrderData[]>([]);
  const userService = new UserServices(client);
  const [showUserDetails, setShowUserDetails] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [timePeriod, setTimePeriod] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      await userService.fetchUserData(setUserData);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userData) {
      form.setFieldsValue(userData); // Set form values only when userData is available
    }
  }, [userData]); // Run this effect whenever userData changes

  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const onFinish = async (values: UserData) => {
    try {
      setUserData((prevData) => ({ ...prevData, ...values }));
      setIsEditing(false);
      setShowPasswordFields(false);
      await userService.updateUserDetails(values);
    } catch {
      message.error("Failed to update profile. Please try again.");
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      form.resetFields();
      setShowPasswordFields(false);
    } else {
      setShowPasswordFields(true);
    }
    setIsEditing(!isEditing);
  };

  const handleImageUpload = async (info: { file: UploadFile }) => {
    // Proceed only if the file is uploaded successfully
    if (info.file && info.file.status === "error") {
      const imageFile = info.file.originFileObj; // Get the actual file

      // Call the function to upload the image
      await userService.updateProfilePicture(imageFile);
    } else if (info.file && info.file.status === "error") {
      message.error("Failed to upload profile picture");
    }
  };

  const excelDownload = async() => {
    await userService.downloadExcelByUser(userData?.id)
  }

  // fetch order history
  useEffect(() => {
    const fetchOrderHistory = async () => {
      await userService.fetchOrders(
        userData?.id,
        setOrderHistory,
        timePeriod,
        searchQuery,
        orderStatus
      );
    };

    if (userData !== undefined) {
      fetchOrderHistory();
    }
  }, [userData, timePeriod, searchQuery, orderStatus]);

  const renderUserDetails = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.userData}
    >
      <Card
        className={styles.responsiveCard}
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Personal Information</span>
            <Tooltip title={isEditing ? "Save Changes" : "Edit Profile"}>
              <Button
                type="primary"
                icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
                onClick={isEditing ? form.submit : toggleEdit}
              />
            </Tooltip>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className={styles.form}
          initialValues={userData} // This might be redundant now
          disabled={!isEditing} // Disable fields when not editing
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  { required: true, message: "Please enter your name" },
                  { min: 2, message: "Name must be at least 2 characters" },
                ]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input prefix={<PhoneOutlined />} readOnly />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="pincode"
                label="Pincode"
                rules={[
                  { required: true, message: "Please enter your pincode" },
                  { len: 6, message: "Pincode must be exactly 6 characters" },
                ]}
              >
                <Input prefix={<EnvironmentOutlined />} type="number" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item name="city" label="City">
                <Input prefix={<EnvironmentOutlined />} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item name="state" label="State">
                <Input prefix={<EnvironmentOutlined />} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item name="country" label="Country">
                <Input prefix={<EnvironmentOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          {isEditing && showPasswordFields && (
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="password"
                  label="New Password"
                  rules={[
                    { required: true, message: "Please enter your password" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    { required: true, message: "Please confirm your password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The two passwords that you entered do not match!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} />
                </Form.Item>
              </Col>
            </Row>
          )}

          {isEditing && (
            <Form.Item>
              <Button
                onClick={toggleEdit}
                icon={<CloseOutlined />}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Save Changes
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>
    </motion.div>
  );

  const renderOrderHistory = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className={styles.responsiveCard}
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Order History</span>
            {orderHistory.length > 0 && (
              <button
                className={styles.downloadButton}
                onClick={excelDownload}
              >
                <i className="ri-file-excel-2-line"></i>
                Download
              </button>
            )}
          </div>
        }
      >
        <div className={styles.orderHistory}>
          <OrderHistory
            orderList={orderHistory}
            setSearchQuery={setSearchQuery}
            setOrderStatus={setOrderStatus}
            setTimePeriod={setTimePeriod}
          />
        </div>
      </Card>
    </motion.div>
  );

  const handleTabChange = (key: string) => {
    setShowUserDetails(key === "1");
  };

  return (
    <div className={styles.userProfileContainer}>
      {showUserDetails && (
        <div className={styles.profileHeader}>
          <Avatar
            size={100}
            icon={<CameraOutlined />}
            src={userData?.profileImage || ""}
            style={{ marginBottom: 16 }}
          />
          <div className={styles.greetings}>
            <h1>Hello, {userData?.name}</h1>
            <Upload
              name="profileImage"
              showUploadList={false}
              action="/upload" // Replace with your actual upload endpoint
              onChange={handleImageUpload}
            >
              <Button icon={<CameraOutlined />} style={{ marginBottom: 16 }}>
                Change Profile Picture
              </Button>
            </Upload>
          </div>
        </div>
      )}
      <Tabs
        defaultActiveKey="1"
        className={styles.tab}
        onChange={handleTabChange}
      >
        <TabPane tab="Personal Details" key="1" className={styles.tab}>
          {renderUserDetails()}
        </TabPane>
        <TabPane tab="Orders" key="2">
          {renderOrderHistory()}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UserProfile;
