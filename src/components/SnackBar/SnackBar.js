import styles from './SnackBar.module.css';
import { Snackbar, Alert } from '@mui/material';

export const GenericSnackbar = ({
    open,
    onClose,
    message,
    severity = 'success',
    autoHideDuration = 6000,
    anchorOrigin = { vertical: 'bottom', horizontal: 'right' }
}) => {
    const alertClass = {
        success: styles.alertSuccess,
        error: styles.alertError,
        warning: styles.alertWarning,
        info: styles.alertInfo
    }[severity];

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={anchorOrigin}
            className={styles.snackbar}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                className={`${styles.alert} ${alertClass}`}
                elevation={6}
                variant="filled"
            >
                {message}
            </Alert>
        </Snackbar>
    );
};
