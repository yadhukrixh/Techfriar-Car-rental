"use client";
import React, { useEffect, useState } from "react";
import styles from "./add-cars.module.css";
import BackButton from "@/themes/back-button/back-button";
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from "@apollo/client";
import InputComponent from "@/themes/input-component/input-component";
import ButtonComponent from "@/themes/button-component/button-component";
import { Upload, Select, Spin } from "antd";
import {
  LoadingOutlined,
  UploadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { AddVehicleClass } from "../services/add-vehicle-service";
import { Brand } from "@/interfaces/brands";
import QuantitySelector from "@/themes/quantity-selector/quantity-selector";

const { Option } = Select;

const AddCars = () => {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [brands, setBrands] = useState<Brand[]>([]);
  const [vehicleName, setVehicleName] = useState("");
  const [description, setDescription] = useState("");
  const [fuelType, setFuelType] = useState<string | null>(null);
  const [transmissionType, setTransmissionType] = useState<string>("");
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [otherImages, setOtherImages] = useState<File[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [numSeats, setNumSeats] = useState<number>(2);
  const [numDoors, setNumDoors] = useState<number>(2);
  const [pricePerDay,setPricePerday] = useState<string>('')

  const addVehicleClass = new AddVehicleClass();

  useEffect(() => {
    const fetchBrands = async () => {
      await addVehicleClass.fetchBrands(client, setBrands);
      setLoading(false);
    };
    fetchBrands();
  }, [client]);

  const handleFileChange = (info: any, type: string) => {
    addVehicleClass.handleFileChange(
      info,
      type,
      setPrimaryImage,
      setOtherImages
    );
  };

  const handleAddVehicleClick = async () => {
    if (!primaryImage || !selectedBrand) {
      alert("Please select a primary image and brand before submitting.");
      return;
    }
    await addVehicleClass.handleAddVehicle(
      client,
      vehicleName,
      description,
      primaryImage,
      otherImages,
      selectedBrand,
      quantity,
      selectedYear,
      fuelType,
      transmissionType,
      numSeats,
      numDoors,
      parseInt(pricePerDay,10)
    );
  };

  const handleBrandChange = (value: number) => setSelectedBrand(value);
  const handleYearChange = (value: number) => setSelectedYear(value);
  const handleFuelTypeChange = (value: string) => setFuelType(value);
  const handleTransmissionChange = (value: string) => setTransmissionType(value);

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1980; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <Spin
          indicator={
            <LoadingOutlined
              style={{ fontSize: "70px", color: "rgb(0, 9, 79)" }}
              spin
            />
          }
        />
      </div>
    );
  }

  return (
    <div className={styles.addVehicleWrapper}>
      <div className={styles.addVehicleContainer}>
        <div className={styles.header}>
          <BackButton />
          <h2 className={styles.title}>Add New Vehicle</h2>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formSection}>
            <label className={styles.inputLabel}>Vehicle Name</label>
            <InputComponent
              value={vehicleName}
              type="text"
              onChange={setVehicleName}
              customClassName={styles.vehicleNameInput}
              placeholder="Vehicle model name"
            />
          </div>

          <div className={styles.formSection}>
            <label className={styles.inputLabel}>Daily Rate</label>
            <InputComponent
              value={pricePerDay}
              type="number"
              onChange={setPricePerday}
              customClassName={styles.vehicleNameInput}
              placeholder="Price Per Day"
            />
          </div>

          <div className={styles.formSection}>
            <label className={styles.inputLabel}>Quantity</label>
            <QuantitySelector
              minimum={1}
              quantity={quantity}
              setQuantity={setQuantity}
            />
          </div>

          <div className={styles.formSection}>
            <label className={styles.inputLabel}>Brand</label>
            <Select
              showSearch
              placeholder="Select a brand"
              onChange={handleBrandChange}
              style={{ width: "100%" }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {brands.map((brand) => (
                <Option key={brand.id} value={brand.id}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </div>

          <div className={styles.formSection}>
            <label className={styles.inputLabel}>Model Year</label>
            <Select
              showSearch
              placeholder="Select model year"
              onChange={handleYearChange}
              style={{ width: "100%" }}
            >
              {generateYearOptions().map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </div>

          <div className={styles.formSection}>
            <label className={styles.inputLabel}>Description</label>
            <textarea
              className={styles.textAreaInput}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter vehicle description"
            />
          </div>

          <div className={styles.formSection}>
            <label className={styles.inputLabel}>Fuel Type</label>
            <Select
              placeholder="Select fuel type"
              onChange={handleFuelTypeChange}
              className={styles.selectInput}
            >
              <Option value="petrol">Petrol</Option>
              <Option value="diesel">Diesel</Option>
              <Option value="ev">EV</Option>
            </Select>
          </div>

          <div className={styles.formSection}>
            <label className={styles.inputLabel}>Transmission Type</label>
            <Select
              placeholder="Select transmission type"
              onChange={handleTransmissionChange}
              className={styles.selectInput}
            >
              <Option value="automatic">Automatic</Option>
              <Option value="manual">Manual</Option>
            </Select>
          </div>

          <div className={styles.formSection}>
            <label className={styles.inputLabel}>Number of Seats</label>
            <QuantitySelector
              minimum={2}
              quantity={numSeats}
              setQuantity={setNumSeats}
            />
          </div>

          <div className={styles.formSection}>
            <label className={styles.inputLabel}>Number of Doors</label>
            <QuantitySelector minimum={2} quantity={numDoors} setQuantity={setNumDoors} />
          </div>

          <div className={styles.uploadSection}>
            <label className={styles.inputLabel}>Primary Image</label>
            <Upload
              name="primaryImage"
              listType="picture-card"
              maxCount={1}
              accept="image/*"
              onChange={(info) => handleFileChange(info, "primary")}
              beforeUpload={() => false}
              className={styles.uploadComponent}
            >
              {primaryImage ? null : (
                <div className={styles.uploadButton}>
                  <UploadOutlined />
                  <div>Upload Primary Image</div>
                </div>
              )}
            </Upload>
          </div>

          <div className={styles.uploadSection}>
            <label className={styles.inputLabel}>Other Images</label>
            <Upload
              name="otherImages"
              listType="picture-card"
              maxCount={4}
              accept="image/*"
              multiple
              onChange={(info) => handleFileChange(info, "other")}
              beforeUpload={() => false}
              className={styles.uploadComponent}
            >
              {otherImages.length >= 4 ? null : (
                <div className={styles.uploadButton}>
                  <PlusOutlined />
                  <div className={styles.otherImagesLabel}>
                    Upload Other Images{" "}
                    <span>(Max {4 - otherImages.length})</span>
                  </div>
                </div>
              )}
            </Upload>
          </div>
        </div>

        <div className={styles.buttonSection}>
          <ButtonComponent
            value="Add Vehicle"
            onClickFunction={handleAddVehicleClick}
            className={styles.submitButton}
          />
        </div>
      </div>
    </div>
  );
};

export default AddCars;
