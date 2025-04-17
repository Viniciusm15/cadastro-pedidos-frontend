import styles from './FileUploadButton.module.css';
import React, { useState } from 'react';

export default function FileUploadButton({ onUpload, accept = '*/*', buttonText = 'Choose file', error }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (validImageTypes.includes(file.type)) {
        onUpload(file);
      }
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <div className={styles.fileInputWrapper}>
        <input
          type='file'
          accept={accept}
          onChange={handleFileChange}
          id='file-upload'
          className={`${styles.fileInput} ${error ? styles.errorInput : ''}`}
        />
        <label htmlFor='file-upload' className={styles.fileLabel}>
          {selectedFile ? selectedFile.name : buttonText}
        </label>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
