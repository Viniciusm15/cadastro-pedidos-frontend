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
  additionalFields
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
              style: { color: '#ffffff' }
            }}
            InputProps={{
              className: styles.formField
            }}
            sx={{ marginTop: '10px' }}
          />
        ))}
        {additionalFields}
      </LocalizationProvider>
      <Button type='submit' variant='contained' color='primary' className={styles.submitButton}>
        {submitLabel}
      </Button>
    </form>
  );
}
