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
        style: { color: '#2f2f2f' },
        sx: {
          color: '#2f2f2f',
          '&::before': {
            borderBottom: '1px solid #334155'
          }
        }
      }}
      InputProps={{
        className: styles.inputField,
        sx: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#334155'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#334155'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#334155',
            borderWidth: '1px'
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#334155'
          },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: '#334155'
          }
        }
      }}
      sx={{ marginTop: '10px' }}
      {...props}
    />
  );
}
