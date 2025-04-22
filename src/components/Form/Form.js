import styles from './Form.module.css';
import { Button, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react';

export default function GenericForm({
  formState,
  handleInputChange,
  handleSubmit,
  fields,
  submitLabel,
  additionalFields,
  formErrors = {}
}) {
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {fields.map((field) => (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            value={formState[field.name] ?? ''}
            onChange={handleInputChange}
            fullWidth
            multiline={field.multiline}
            rows={field.rows || 1}
            type={field.type || 'text'}
            InputLabelProps={{
              className: styles.inputLabel
            }}
            InputProps={{
              className: `${styles.inputField} ${field.type === 'number' ? styles.numberInput : ''}`,
              sx: {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2f2f2f'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#262f37',
                  borderWidth: '1px '
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#262f37',
                  borderWidth: '1px'
                }
              }
            }}
            sx={{
              marginTop: '16px',
              '& .MuiInputBase-input': {
                padding: field.type === 'number' ? '8px 0 8px 8px' : '8px 0'
              }
            }}
            error={Boolean(formErrors[field.name])}
            helperText={formErrors[field.name] || ''}
            FormHelperTextProps={{
              className: styles.helperText
            }}
          />
        ))}
        {additionalFields}
      </LocalizationProvider>

      <Button type='submit' variant='contained' className={styles.submitButton}>
        {submitLabel}
      </Button>
    </form>
  );
}
