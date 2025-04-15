import styles from './Modal.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import React from 'react';

export default function GenericModal({ open, handleClose, title, children }) {
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby='modal-title' aria-describedby='modal-description'>
      <Box className={styles.modalBox}>
        <IconButton className={styles.modalCloseButton} onClick={handleClose} aria-label='close'>
          <CloseIcon />
        </IconButton>
        <Typography id='modal-title' className={styles.modalTitle}>
          {title}
        </Typography>
        <div className={styles.modalContent} id='modal-description'>
          {children}
        </div>
      </Box>
    </Modal>
  );
}
