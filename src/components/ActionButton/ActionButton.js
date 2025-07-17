import styles from './ActionButton.module.css';
import { IconButton, Tooltip } from '@mui/material';

export function GenericActionButton({
    icon,
    tooltip,
    onClick,
    color = 'primary',
    size = 'small',
    className = '',
    ...props
}) {
    return (
        <Tooltip title={tooltip} arrow>
            <IconButton
                color={color}
                onClick={onClick}
                size={size}
                className={`${styles.button} ${className}`}
                {...props}
            >
                {icon}
            </IconButton>
        </Tooltip>
    );
}
