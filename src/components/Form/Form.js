import styles from "./Form.module.css";
import { Button, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React from "react";

export default function GenericForm({
  formState,
  handleInputChange,
  handleSubmit,
  fields,
  submitLabel,
  handleDateChange,
}) {
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {fields.map((field) =>
          field.type === "date" ? (
            <DatePicker
              key={field.name}
              label={field.label}
              value={formState[field.name]}
              onChange={(date) => handleDateChange(field.name, date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  InputLabelProps: {
                    style: { color: "#ffffff" },
                  },
                  InputProps: {
                    className: styles.formField,
                  },
                  inputProps: {},
                  sx: {
                    marginTop: "10px",
                    "& .MuiSvgIcon-root": {
                      color: "#ffffff", // cor do ícone do calendário
                    },
                  },
                },
              }}
            />
          ) : (
            <TextField
              key={field.name}
              name={field.name}
              label={field.label}
              value={formState[field.name]}
              onChange={handleInputChange}
              fullWidth
              multiline={field.multiline}
              rows={field.rows || 1}
              InputLabelProps={{
                style: { color: "#ffffff" },
              }}
              InputProps={{
                className: styles.formField,
              }}
              sx={{ marginTop: "10px" }}
            />
          ),
        )}
      </LocalizationProvider>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={styles.submitButton}
      >
        {submitLabel}
      </Button>
    </form>
  );
}
