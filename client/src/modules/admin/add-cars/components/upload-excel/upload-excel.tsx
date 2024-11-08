// ExcelUploadModal.tsx
import React, { useState } from "react";
import { Modal, Upload } from "antd";
import ButtonComponent from "@/themes/button-component/button-component";
import styles from "./upload-excel.module.css";

interface ExcelUploadModalProps {
  isVisible: boolean;
  onClose: () => void;
  setExcelFile: (file: File) => void;
  handleUpload: () => void;
}

const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  isVisible,
  onClose,
  setExcelFile,
  handleUpload
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleExcelUpload = (file: File) => {
    setSelectedFile(file);
    handleUpload();
    return false; // Prevent automatic upload
  };


  const handleFileChange = (info: any) => {
    const { file } = info;
    if (file.status === "removed") {
      setSelectedFile(null);
    } else if (file) {
      setSelectedFile(file);
      setExcelFile(file);
    }
  };

  return (
    <Modal
      title={<div className={styles.modalTitle}>Upload Excel File</div>}
      visible={isVisible}
      onOk={handleUpload}
      onCancel={onClose}
      okText="Upload"
      cancelText="Cancel"
      className={styles.modalContainer}
    >
      <Upload
        beforeUpload={handleExcelUpload}
        accept=".xls,.xlsx"
        showUploadList={false}
        onChange={handleFileChange}
      >
        <ButtonComponent
          value="Select Excel File"
          className={styles.uploadButton}
        />
      </Upload>
      {selectedFile && (
        <p className={styles.selectedFileText}>Selected file: {selectedFile.name}</p>
      )}
    </Modal>
  );
};

export default ExcelUploadModal;
