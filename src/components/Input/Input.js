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
        style: { color: '#ffffff' },
        sx: {
          color: '#ffffff',
          '&::before': {
            borderBottom: '1px solid #2f2f2f'
          }
        }
      }}
      InputProps={{
        className: styles.inputField,
        sx: {
          marginTop: '10px',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2f2f2f'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#262f37'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#262f37',
            borderWidth: '1px'
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#262f37'
          },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: '#262f37'
          }
        }
      }}
      sx={{ marginTop: '10px' }}
      {...props}
    />
  );
}
