import styles from "./Form.module.css";
import { Button, TextField } from "@mui/material";
import React from "react";

export default function GenericForm({
  formState,
  handleInputChange,
  handleSubmit,
  fields,
  submitLabel,
}) {
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {fields.map((field) => (
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
      ))}
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
