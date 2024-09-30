"use client";

import React, { useEffect, useState } from "react";
import styles from "./add-brand.module.css";
import BackButton from "@/themes/back-button/back-button";
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from "@apollo/client";
import { AddBrandClass } from "../services/add-brand-service";
import InputComponent from "@/themes/input-component/input-component";
import ButtonComponent from "@/themes/button-component/button-component";
import { message, Upload, Select, Spin } from "antd";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddBrand = () => {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [countries, setCountries] = useState<string[]>([]);
  const [brandName, setBrandName] = useState("");
  const [brandLogo, setBrandLogo] = useState<File | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for the country fetch

  const addBrandClass = new AddBrandClass();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching
      await addBrandClass.fetchCountries(client, setCountries);
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData(); // Call the async function
  }, [client]);

  const handleFileChange = (info: any) => {
    console.log(info); // Log the info object for debugging
    const { fileList } = info; // Destructure fileList from info

    // Check if there are any files in the fileList
    if (fileList.length > 0) {
        const latestFile = fileList[0]; // Get the first file (assuming only one is uploaded)
        setBrandLogo(latestFile.originFileObj); // Set the actual file object
        message.success(`${latestFile.name} file uploaded successfully`);
    } else {
        setBrandLogo(null); // Reset state if no files are selected
        message.info("Brand logo removed."); // Optional: notify user if no file
    }
};

  const handleAddBrandClick = () => {
    if (!brandLogo) {
      alert("Please select a brand logo before submitting.");
      return;
    }
    addBrandClass.handleAddBrand(client, brandName, brandLogo, selectedCountry);
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
  };

  const customSpinStyle = {
    fontSize: "70px", // Adjust size here
    color: "rgb(0, 9, 79)", // Change color here
  };

  // Custom loading indicator
  const customIndicator = <LoadingOutlined style={customSpinStyle} spin />;

  // Show loading spinner while fetching countries
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className={styles.spinnerContainer}
      >
        <Spin indicator={customIndicator} />
      </div>
    );
  }

  return (
    <div className={styles.addBrandWrapper}>
      <div className={styles.addBrandContainer}>
        <div className={styles.header}>
          <BackButton />
          <h2 className={styles.title}>Add New Brand</h2>
        </div>

        <div className={styles.formSection}>
          <label className={styles.inputLabel}>Brand Name</label>
          <InputComponent
            value={brandName}
            type="text"
            onChange={setBrandName}
            customClassName={styles.brandNameInput}
            toUppercase={true}
          />
        </div>

        <div className={styles.uploadSection}>
          <label className={styles.inputLabel}>Brand Logo</label>

          <Upload
            name="brandLogo"
            listType="picture-card"
            maxCount={1}
            accept="image/*"
            onChange={handleFileChange}
            beforeUpload={() => false}
            className={styles.uploadComponent}
            onRemove={() => setBrandLogo(null)} // Reset state on remove
          >

                <div className={styles.uploadButton}>
                  <UploadOutlined />
                  <div>Upload Logo</div>
                </div>

          </Upload>
        </div>

        <div className={styles.formSection}>
          <label className={styles.inputLabel}>Country</label>
          <Select
            showSearch
            placeholder="Select a country"
            onChange={handleCountryChange}
            style={{ width: "100%", maxWidth:"500px"}}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {countries.map((country, index) => (
              <Option key={index} value={country}>
                {country}
              </Option>
            ))}
          </Select>
        </div>

        <div className={styles.buttonSection}>
          <ButtonComponent
            value="Add Brand"
            onClickFunction={handleAddBrandClick}
            className={styles.submitButton}
          />
        </div>
      </div>
    </div>
  );
};

export default AddBrand;
