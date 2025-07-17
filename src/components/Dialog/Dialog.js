import styles from './Dialog.module.css';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from '@mui/material';

export const GenericDialog = ({
    open,
    onClose,
    title,
    content,
    primaryButtonText,
    secondaryButtonText,
    onPrimaryButtonClick,
    onSecondaryButtonClick,
    primaryButtonDisabled = false,
    fullWidth = true,
    maxWidth = 'sm'
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            classes={{ paper: styles.dialogRoot }}
        >
            <DialogTitle className={styles.dialogTitle}>{title}</DialogTitle>
            <DialogContent className={styles.dialogContent}>
                {typeof content === 'string' ? (
                    <Typography variant="body1">{content}</Typography>
                ) : (
                    content
                )}
            </DialogContent>
            <DialogActions className={styles.dialogActions}>
                {secondaryButtonText && (
                    <Button
                        onClick={onSecondaryButtonClick || onClose}
                        className={styles.secondaryButton}
                    >
                        {secondaryButtonText}
                    </Button>
                )}
                <Button
                    onClick={onPrimaryButtonClick}
                    className={styles.primaryButton}
                    disabled={primaryButtonDisabled}
                >
                    {primaryButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
