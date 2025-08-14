import styles from './Select.module.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Select, MenuItem, InputLabel, FormControl, FormHelperText, Checkbox, ListItemText, Chip } from '@mui/material';
import React from 'react';

export default function GenericSelect({
  label = '',
  name,
  value,
  options,
  onChange,
  multiple,
  renderValue,
  error,
  onRemoveItem
}) {
  const handleSelectChange = (event) => {
    const selectedValues = event.target.value;

    if (multiple && Array.isArray(value) && Array.isArray(selectedValues)) {
      const removedItems = value.filter((item) => !selectedValues.includes(item));
      if (onRemoveItem && removedItems.length > 0) {
        removedItems.forEach((item) => onRemoveItem(item));
      }
    }

    onChange({
      target: {
        name,
        value: selectedValues
      }
    });
  };

  const defaultRenderValue = (selected) => {
    if (multiple) {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {selected.map((value) => {
            const option = options.find((opt) => opt.value === value);
            return (
              <Chip
                key={value}
                label={option?.label || value}
                sx={{
                  color: '#ffffff',
                  backgroundColor: '#262f37',
                  cursor: 'default'
                }}
              />
            );
          })}
        </div>
      );
    }
    const selectedOption = options.find((opt) => opt.value === selected);
    return selectedOption?.label || selected;
  };

  return (
    <FormControl fullWidth className={styles.formControl} error={!!error}>
      <InputLabel className={styles.inputLabel}>
        {label}
      </InputLabel>
      <Select
        name={name}
        value={value}
        onChange={handleSelectChange}
        multiple={multiple}
        className={styles.select}
        IconComponent={ArrowDropDownIcon}
        renderValue={renderValue || defaultRenderValue}
        label={label}
        sx={{
          color: '#1e293b',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1e293b'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1e293b'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1e293b',
            borderWidth: '1px'
          },
          '& .MuiSelect-icon': {
            color: '#1e293b',
            fontSize: '1.5rem'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#ff0000ff !important'
          }
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {multiple ? (
              <React.Fragment>
                <Checkbox checked={Array.isArray(value) ? value.includes(option.value) : value === option.value} />
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
