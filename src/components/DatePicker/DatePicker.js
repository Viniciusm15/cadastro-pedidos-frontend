import styles from './DatePicker.module.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React from 'react';

export default function GenericDatePicker({ label, value, onChange, disabled = false, error }) {
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
            error: !!error,
            helperText: error || '',
            InputProps: {
              className: styles.inputBase,
              sx: {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2f2f2f'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#262f37'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#262f37',
                  borderWidth: '1px'
                }
              }
            },
            InputLabelProps: {
              className: styles.inputLabel
            },
            FormHelperTextProps: {
              className: styles.helperText
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
