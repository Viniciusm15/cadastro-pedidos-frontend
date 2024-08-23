import styles from "./List.module.css";
import InboxIcon from "@mui/icons-material/Inbox";
import { List, ListItem, ListItemText, Typography, Box } from "@mui/material";
import React from "react";

export default function GenericList({
  items,
  primaryText,
  secondaryText,
  emptyMessage,
}) {
  if (!items || items.length === 0) {
    return (
      <Box className={styles.emptyBox}>
        <InboxIcon className={styles.emptyIcon} />
        <Typography className={styles.emptyMessage}>
          {emptyMessage || "No items available"}
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {items.map((item, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={primaryText(item)}
            secondary={secondaryText && secondaryText(item)}
          />
        </ListItem>
      ))}
    </List>
  );
}
