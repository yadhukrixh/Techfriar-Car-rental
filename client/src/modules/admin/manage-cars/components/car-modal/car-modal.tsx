import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Upload, Button, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { CarData } from "@/interfaces/cars";
import styles from "./car-modal.module.css";
import QuantitySelector from "@/themes/quantity-selector/quantity-selector";
import { AddVehicleClass } from "@/modules/admin/add-cars/services/add-vehicle-service";
import { ApolloClient, NormalizedCacheObject, useApolloClient } from "@apollo/client";
import { ManageCars } from "../../services/manage-cars-services";

interface Brand {
  id: number;
  name: string;
}

interface CarModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (carData: CarData) => void;
  carData?: CarData; // To edit existing car data
  brands?: Brand[]; // List of brands to populate the brand selector
}

const { Title } = Typography;

const CarModal: React.FC<CarModalProps> = ({
  visible,
  onCancel,
  onSave,
  carData,
}) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [brandName, setBrandName] = useState<string | undefined>(undefined);
  const [primaryImage, setPrimaryImage] = useState<UploadFile[]>([]);
  const [secondaryImages, setSecondaryImages] = useState<UploadFile[]>([]);
  const [availableQuantity, setAvailableQuantity] = useState<number>(1);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [fuelType, setFuelType] = useState<string>(""); // Default value
  const [transmissionType, setTransmissionType] = useState<string>(""); // Default value
  const [numberOfSeats, setNumberOfSeats] = useState<number>(1);
  const [numberOfDoors, setNumberOfDoors] = useState<number>(1);
  const [carId, setCarId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const manageCarsClass = new ManageCars(client);
  const [brands, setBrands] = useState<Brand[]>([]);

  const handleFuelTypeChange = (value: string) => setFuelType(value);
  const handleTransmissionChange = (value: string) => setTransmissionType(value);
  const handleYearChange = (value: number) => setSelectedYear(value);

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1980; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  useEffect(() => {
    const addVehicleClass = new AddVehicleClass();

    const fetchBrands = async () => {
      await addVehicleClass.fetchBrands(client, setBrands);
    };
    fetchBrands();

    if (carData) {
      setName(carData.name);
      setDescription(carData.description);
      setBrandName(carData.brandName);
      setPrimaryImage([{ url: carData.primaryImage, uid: "-1", name: "Primary Image" }]);
      setSecondaryImages(
        carData.otherImages.map((url, index) => ({
          uid: `${index}`,
          name: `secondary-image-${index}`,
          url,
        }))
      );
      setAvailableQuantity(carData.availableQuantity);
      setYear(carData.year);
      setFuelType(carData.fuelType);
      setTransmissionType(carData.transmissionType);
      setNumberOfSeats(carData.numberOfSeats);
      setNumberOfDoors(carData.numberOfDoors);
      setSelectedYear(carData.year);
      setCarId(carData.id);
    }
  }, [carData]);

  const handlePrimaryImageChange = ({ fileList }: { fileList: UploadFile[] }) => {
    if (fileList.length > 0) {
      const file = fileList[0]; // Only one image allowed

      if (file.url) {
        // Handle existing image (from URL)
        setPrimaryImage([file]);
      } else if (file.originFileObj) {
        // Handle new image upload
        setPrimaryImage([file]);
      }
    } else {
      setPrimaryImage([]);
    }
  };

  const handleSecondaryImagesChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setSecondaryImages(fileList);
  };

  const handleSave = async () => {
    let primaryImageToSend: string | File | null = null;

    if (primaryImage.length > 0) {
      const file = primaryImage[0];
      if (file.url) {
        primaryImageToSend = file.url; // Use URL for existing image
      } else if (file.originFileObj) {
        primaryImageToSend = file.originFileObj; // Use File for new image
      }
    }

    await manageCarsClass.editCar(
      carId,
      name,
      description,
      brandName,
      primaryImageToSend,
      secondaryImages.map((file) => (file.originFileObj || file.url)),
      availableQuantity,
      year,
      fuelType,
      transmissionType,
      numberOfSeats,
      numberOfDoors
    );
  };

  return (
    <Modal
      className={styles.modalWrapper}
      title={carData ? "Edit Car" : "Add Car"}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSave}
      okText="Save"
      cancelText="Cancel"
    >
      <div className={styles.modalContainer}>
        <Title level={4} className={styles.title}>
          Car Details
        </Title>

        <Input
          placeholder="Enter car name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.inputField}
        />

        <Input.TextArea
          rows={6}
          placeholder="Enter car description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.inputField}
        />

        <Select
          placeholder="Select a brand"
          value={brandName}
          onChange={setBrandName}
          className={styles.inputField}
        >
          {brands?.map((brand) => (
            <Select.Option key={brand.name} value={brand.name}>
              {brand.name}
            </Select.Option>
          ))}
        </Select>

        <Upload
          listType="picture"
          fileList={primaryImage}
          onChange={handlePrimaryImageChange}
          beforeUpload={() => false}
          maxCount={1}
          className={styles.uploadButton}
        >
          <Button icon={<UploadOutlined />}>Upload Primary Image</Button>
        </Upload>

        <Upload
          listType="picture"
          fileList={secondaryImages}
          onChange={handleSecondaryImagesChange}
          beforeUpload={() => false}
          maxCount={4}
          className={styles.uploadButton}
        >
          {secondaryImages.length < 4 && (
            <Button icon={<UploadOutlined />}>Upload Additional Images</Button>
          )}
        </Upload>

        <div>
          <label>Available Quantity</label>
          <QuantitySelector
            minimum={2}
            quantity={availableQuantity}
            setQuantity={setAvailableQuantity}
          />
        </div>

        <div>
          <label>Year:</label>
          <Select
            showSearch
            placeholder="Select model year"
            onChange={handleYearChange}
            style={{ width: "100%" }}
            value={selectedYear}
          >
            {generateYearOptions().map((year) => (
              <Select.Option key={year} value={year}>
                {year}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className={styles.formSection}>
          <label className={styles.inputLabel}>Transmission Type:</label>
          <Select
            placeholder="Select transmission type"
            onChange={handleTransmissionChange}
            className={styles.selectInput}
            value={transmissionType}
          >
            <Select.Option value="automatic">Automatic</Select.Option>
            <Select.Option value="manual">Manual</Select.Option>
          </Select>
        </div>

        <div className={styles.formSection}>
          <label className={styles.inputLabel}>Fuel Type:</label>
          <Select
            placeholder="Select fuel type"
            onChange={handleFuelTypeChange}
            className={styles.selectInput}
            value={fuelType}
          >
            <Select.Option value="petrol">Petrol</Select.Option>
            <Select.Option value="diesel">Diesel</Select.Option>
            <Select.Option value="electric">Electric</Select.Option>
          </Select>
        </div>

        <div className={styles.formSection}>
          <label>Number of Seats:</label>
          <QuantitySelector minimum={2} quantity={numberOfSeats} setQuantity={setNumberOfSeats} />
        </div>

        <div className={styles.formSection}>
          <label>Number of Doors:</label>
          <QuantitySelector minimum={2} quantity={numberOfDoors} setQuantity={setNumberOfDoors} />
        </div>
      </div>
    </Modal>
  );
};

export default CarModal;
