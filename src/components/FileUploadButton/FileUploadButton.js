import styles from './FileUploadButton.module.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Typography } from '@mui/material';
import React, { useState } from 'react';

export default function FileUploadButton({ onUpload, accept = 'image/*', buttonText = 'Upload Product Image', error, initialFile = null }) {
  const [selectedFile, setSelectedFile] = useState(initialFile);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (validImageTypes.includes(file.type)) {
        onUpload(file);
      }
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <input type='file' accept={accept} onChange={handleFileChange} id='file-upload' className={styles.fileInput} />
      <label htmlFor='file-upload' className={styles.fileLabel}>
        <Button variant='outlined' component='span' startIcon={<CloudUploadIcon />} className={styles.uploadButton}>
          {buttonText}
        </Button>
        {selectedFile && (
          <Typography variant='body2'className={styles.fileName}>
            {selectedFile.name}
          </Typography>
        )}
      </label>
      {error && (
        <Typography color='error' variant='caption' className={styles.errorMessage}>
          {error}
        </Typography>
      )}
    </div>
  );
}
