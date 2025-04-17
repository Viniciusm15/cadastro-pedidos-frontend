import styles from './Select.module.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Select, MenuItem, InputLabel, FormControl, FormHelperText, Checkbox, ListItemText } from '@mui/material';
import React from 'react';

export default function GenericSelect({ label = '', name, value, options, onChange, multiple, renderValue, error }) {
  const handleSelectChange = (event) => {
    const selectedValues = event.target.value;
    onChange({
      target: {
        name,
        value: selectedValues
      }
    });
  };

  return (
    <FormControl fullWidth className={styles.formControl} error={!!error}>
      <InputLabel className={styles.inputLabel} sx={{ color: '#ffffff !important' }}>
        {label}
      </InputLabel>
      <Select
        name={name}
        value={value}
        onChange={handleSelectChange}
        multiple={multiple}
        className={styles.select}
        IconComponent={ArrowDropDownIcon}
        renderValue={renderValue}
        label={label}
        sx={{
          color: '#ffffff',
          '& .MuiSelect-icon': {
            color: '#ffffff',
            fontSize: '1.5rem'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#ffffff !important'
          }
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {multiple ? (
              <React.Fragment>
                <Checkbox checked={value.includes(option.value)} />
                <ListItemText primary={option.label} />
              </React.Fragment>
            ) : (
              option.label
            )}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText className={styles.helperText}>{error}</FormHelperText>}
    </FormControl>
  );
}
