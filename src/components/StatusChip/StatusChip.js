import styles from './StatusChip.module.css';
import React from 'react';
import { Chip } from '@mui/material';
import { OrderStatus, getStatusByValue, getStatusByDescription } from '@/enums/OrderStatus';

export function GenericStatusChip({
    status,
    label,
    icon,
    color,
    variant = 'filled',
    size = 'small',
    clickable = false,
    className = '',
    onClick
}) {
    let statusConfig;

    if (typeof status === 'number') {
        statusConfig = getStatusByValue(status);
    } else if (typeof status === 'string') {
        statusConfig = getStatusByDescription(status);
    } else {
        statusConfig = status;
    }

    if (!statusConfig) {
        statusConfig = OrderStatus.PENDING;
    }

    const renderIcon = () => {
        if (React.isValidElement(icon)) {
            return (
                <span className={styles.iconWrapper}>
                    {icon}
                </span>
            );
        }

        if (icon && typeof icon === 'function') {
            const IconComponent = icon;
            return (
                <span className={styles.iconWrapper}>
                    <IconComponent fontSize="small" />
                </span>
            );
        }

        if (statusConfig.Icon) {
            const StatusIcon = statusConfig.Icon;
            return (
                <span className={styles.iconWrapper}>
                    <StatusIcon fontSize="small" />
                </span>
            );
        }

        return null;
    };

    return (
        <Chip
            className={`${styles.chip} ${className}`}
            label={label || statusConfig.displayText}
            color={color || statusConfig.color}
            variant={variant}
            size={size}
            icon={renderIcon()}
            clickable={clickable}
            onClick={onClick}
            sx={{
                fontWeight: 'medium',
                '& .MuiChip-icon': {
                    marginLeft: '4px'
                },
                '&:hover': clickable ? {
                    opacity: 0.9,
                    transform: 'translateY(-1px)'
                } : {}
            }}
        />
    );
}
