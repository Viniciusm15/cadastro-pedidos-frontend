import styles from "./Box.module.css";
import { Box } from "@mui/material";
import React from "react";

export default function CustomBox({ children }) {
  return <Box className={styles.container}>{children}</Box>;
}
