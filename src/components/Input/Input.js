import styles from './Input.module.css';
import { TextField } from '@mui/material';
import React from 'react';

export default function GenericInput({ name, label, value, onChange, type = 'text', min, max, ...props }) {
  return (
    <TextField
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      min={min}
      max={max}
      fullWidth
      className={styles.inputField}
      InputLabelProps={{
        style: { color: '#ffffff' }
      }}
      InputProps={{
        className: styles.inputField
      }}
      sx={{ marginTop: '10px' }}
      {...props}
    />
  );
}
