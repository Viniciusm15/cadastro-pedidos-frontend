import styles from './List.module.css';
import InboxIcon from '@mui/icons-material/Inbox';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import React from 'react';

export default function GenericList({ items, primaryText, secondaryText, emptyMessage }) {
  if (!items || items.length === 0) {
    return (
      <Box className={styles.emptyBox}>
        <InboxIcon className={styles.emptyIcon} />
        <Typography className={styles.emptyMessage}>{emptyMessage || 'No items available'}</Typography>
      </Box>
    );
  }

  return (
    <List>
      {items.map((item, index) => (
        <ListItem key={index} className={styles.listItem}>
          <ListItemText
            primary={<span className={styles.listItemText}>{primaryText(item)}</span>}
            secondary={
              secondaryText && (
                <span className={styles.listItemTextSecondary}>
                  {typeof secondaryText(item) === 'string'
                    ? secondaryText(item)
                        .split(/(\$\d+\.\d{2})/g)
                        .map((part, i) =>
                          part.match(/\$\d+\.\d{2}/) ? (
                            <span key={i} className={styles.priceHighlight}>
                              {part}
                            </span>
                          ) : (
                            part
                          )
                        )
                    : secondaryText(item)}
                </span>
              )
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
