import styles from './Select.module.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText } from '@mui/material';
import React from 'react';

export default function GenericSelect({ label, name, value, options, onChange, multiple, renderValue }) {
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
    <FormControl fullWidth className={styles.formControl}>
      <InputLabel className={styles.inputLabel}>{label}</InputLabel>
      <Select
        name={name}
        value={value}
        onChange={handleSelectChange}
        multiple={multiple}
        className={styles.select}
        IconComponent={ArrowDropDownIcon}
        renderValue={renderValue}
        sx={{
          color: '#ffffff',
          '& .MuiSelect-icon': {
            color: '#ffffff',
            fontSize: '1.5rem'
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
    </FormControl>
  );
}
