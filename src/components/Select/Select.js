import styles from "./Select.module.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import React from "react";

export default function GenericSelect({
  label,
  name,
  value,
  options,
  onChange,
}) {
  return (
    <FormControl fullWidth className={styles.formControl}>
      <InputLabel className={styles.inputLabel}>{label}</InputLabel>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        className={styles.select}
        IconComponent={ArrowDropDownIcon}
        sx={{
          color: "#ffffff",
          "& .MuiSelect-icon": {
            color: "#ffffff",
            fontSize: "1.5rem",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
