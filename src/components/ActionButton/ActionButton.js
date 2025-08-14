import styles from './ActionButton.module.css';
import { IconButton, Tooltip } from '@mui/material';

export function GenericActionButton({
    icon,
    tooltip,
    onClick,
    color = 'primary',
    disabled = false,
    size = 'small',
    className = '',
    ...props
}) {
    return (
        <Tooltip title={tooltip} arrow>
            <span>
                <IconButton
                    color={color}
                    onClick={onClick}
                    size={size}
                    disabled={disabled}
                    className={`${styles.button} ${className}`}
                    {...props}
                >
                    {icon}
                </IconButton>
            </span>
        </Tooltip>
    );
}
