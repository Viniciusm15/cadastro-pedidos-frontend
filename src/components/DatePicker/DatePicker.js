import styles from './DatePicker.module.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React from 'react';

export default function GenericDatePicker({ label, value, onChange, disabled = false }) {
  const handleDateChange = (newDate) => {
    onChange(newDate ? dayjs(newDate) : null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={handleDateChange}
        disabled={disabled}
        slotProps={{
          textField: {
            InputProps: {
              className: styles.inputBase
            },
            InputLabelProps: {
              className: styles.inputLabel
            },
            classes: {
              root: styles.outlinedInputRoot
            }
          }
        }}
        sx={{
          marginTop: '10px',
          '.MuiSvgIcon-root': {
            color: '#ffffff'
          }
        }}
      />
    </LocalizationProvider>
  );
}
