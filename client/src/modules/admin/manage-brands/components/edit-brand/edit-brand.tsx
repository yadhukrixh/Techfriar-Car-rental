"use client";
import React, { FC, useEffect, useState } from "react";
import { Modal, Button, message, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { Brand } from "@/interfaces/admin/brands";
import Image from "next/image";
import styles from "./edit-brand.module.css";
import InputComponent from "@/themes/input-component/input-component";
import { AddBrandClass } from "@/modules/admin/add-brand/services/add-brand-service";
import { ManageBrandsClass } from "../../services/manage-brands-services";
import { RcFile, UploadChangeParam } from "antd/es/upload";

// Props for the EditBrandModal component
interface EditBrandModalProps {
  visible: boolean; // Controls the modal visibility
  onClose: () => void; // Callback to close the modal
  brand: Brand; // Brand data to edit
  client: ApolloClient<NormalizedCacheObject>; // Apollo client for mutation
}

const EditBrand: FC<EditBrandModalProps> = ({
  visible,
  onClose,
  brand,
  client,
}) => {
  const [newBrandName, setNewBrandName] = useState(brand.name);
  const [newCountry, setNewCountry] = useState<string>(brand.country);
  const [countries, setCountries] = useState<string[]>([]); // Country options state
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const logo = brand.logoUrl;

  const brandClass = new AddBrandClass();
  const manageBrandClass = new ManageBrandsClass(client);

  // Fetch countries from backend
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        await brandClass.fetchCountries(client, setCountries);
      } catch {
        message.error("Failed to fetch countries.");
      }
    };
    
    fetchCountries();
  }, [client]);

  // Handle form submission
  const handleUpdateBrand = async (
    id: number,
    name: string,
    country: string,
    image: File | null
  ) => {
    try {
      await manageBrandClass.updateBrand(id, name, country, image,onClose);
    } catch (error) {
      message.error("Failed to update the brand.");
      console.error(error);
    }
  };

  // Handle file upload for brand logo
  const handleFileChange = (info: UploadChangeParam) => {
    console.log(info); // Log the info object for debugging
    const { fileList } = info; // Destructure fileList from info
  
    // Check if there are any files in the fileList
    if (fileList.length > 0) {
      const latestFile = fileList[0]; // Get the first file (assuming only one is uploaded)
      
      if (latestFile.originFileObj) {
        setNewLogo(latestFile.originFileObj as RcFile); // Set the actual file object with proper type assertion
        message.success(`${latestFile.name} file uploaded successfully`);
      }
    } else {
      setNewLogo(null); // Reset state if no files are selected
      message.info("Brand logo removed."); // Optional: notify user if no file
    }
  };

  return (
    <Modal
      title="Edit Brand :"
      visible={visible}
      onCancel={onClose}
      footer={null}
      className={styles.editBrandContainer}
    >
      <div className={styles.formFields}>
        <label>Brand Name:</label>
        <InputComponent
          type="text"
          value={newBrandName}
          onChange={setNewBrandName}
          toUppercase={true}
        />
      </div>

      <div className={styles.formFields}>
        <label>Country :</label>
        <Select
          showSearch={true}
          placeholder="Select a country"
          defaultValue={brand.country}
          onSelect={setNewCountry}
          options={countries.map((country) => ({
            label: country,
            value: country,
          }))}
        />
      </div>

      {/* Brand Logo Upload */}
      <div>
        <label>Brand Logo:</label>
        <div className={styles.editLogo}>
          <div style={{ marginBottom: 16 }}>
            {newLogo ? null : (
              <div>
                <Image src={logo} alt="Brand Logo" width={100} height={100} />
              </div>
            )}
          </div>
          <Upload
            name="brandLogo"
            listType="picture-card"
            maxCount={1}
            accept="image/*"
            onChange={handleFileChange}
            beforeUpload={() => false}
            onRemove={() => setNewLogo(null)} // Reset state on remove
          >
            {newLogo ? null : (
              <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', margin:'0'}}>
                <UploadOutlined />
                <div style={{margin:'0'}}>Upload Logo</div>
              </div>
            )}
          </Upload>
        </div>
      </div>

      <Button
        type="primary"
        htmlType="submit"
        onClick={() => {
          handleUpdateBrand(brand.id, newBrandName, newCountry, newLogo);
        }}
        className={styles.updateButton}
      >
        Update
      </Button>
    </Modal>
  );
};

export default EditBrand;
