import styles from './StatusChip.module.css';
import React from 'react';
import { Chip, Box } from '@mui/material';
import { OrderStatus, getStatusByValue } from '@/enums/OrderStatus';

export function GenericStatusChip({
    status,
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
    } else if (typeof status === 'object' && status.value !== undefined) {
        statusConfig = status;
    } else {
        statusConfig = OrderStatus.PENDING;
    }

    const renderLabel = () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {statusConfig.Icon && <statusConfig.Icon fontSize="small" />}
            <span>{statusConfig.description}</span>
        </Box>
    );

    return (
        <Chip
            className={`${styles.chip} ${className}`}
            label={renderLabel()}
            color={color || statusConfig.color}
            variant={variant}
            size={size}
            clickable={clickable}
            onClick={onClick}
            sx={{
                fontWeight: 'medium',
                '&:hover': clickable ? {
                    opacity: 0.9,
                    transform: 'translateY(-1px)'
                } : {}
            }}
        />
    );
}
