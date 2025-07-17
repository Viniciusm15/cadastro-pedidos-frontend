import { Schedule, Refresh, Check, Close } from '@mui/icons-material';

export const OrderStatus = {
    PENDING: {
        value: 0,
        description: 'Pending',
        color: 'warning',
        Icon: Schedule
    },
    PROCESSING: {
        value: 1,
        description: 'Processing',
        color: 'info',
        Icon: Refresh
    },
    SHIPPED: {
        value: 2,
        description: 'Shipped',
        color: 'success',
        Icon: Check
    },
    DELIVERED: {
        value: 3,
        description: 'Delivered',
        color: 'success',
        Icon: Check
    },
    CANCELED: {
        value: 4,
        description: 'Canceled',
        color: 'error',
        Icon: Close
    }
};

export const getStatusByValue = (value) => {
    return Object.values(OrderStatus).find(s => s.value === value) || OrderStatus.PENDING;
};

export const getStatusByDescription = (description) => {
    return Object.values(OrderStatus).find(s => s.description === description) || OrderStatus.PENDING;
};

export const OrderStatusOptions = Object.values(OrderStatus).map(status => ({
    value: status.description,
    label: status.description
}));