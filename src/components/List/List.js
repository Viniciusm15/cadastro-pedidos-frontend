import styles from './List.module.css';
import InboxIcon from '@mui/icons-material/Inbox';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import React from 'react';

export default function GenericList({
  items,
  primaryText,
  secondaryText,
  emptyMessage = 'No items available',
  itemClassName
}) {
  if (!items || items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <InboxIcon className={styles.emptyIcon} />
        <Typography className={styles.emptyText}>{emptyMessage}</Typography>
      </div>
    );
  }

  return (
    <List className={styles.list}>
      {items.map((item, index) => (
        <ListItem key={index} className={`${styles.listItem} ${itemClassName || ''}`}>
          <ListItemText
            primary={<span className={styles.listItemText}>{primaryText(item)}</span>}
            secondary={secondaryText && <span className={styles.listItemTextSecondary}>{secondaryText(item)}</span>}
          />
        </ListItem>
      ))}
    </List>
  );
}
