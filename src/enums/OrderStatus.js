export const OrderStatus = {
    PENDING: { value: 0, description: 'Pending' },
    PROCESSING: { value: 1, description: 'Processing' },
    SHIPPED: { value: 2, description: 'Shipped' },
    DELIVERED: { value: 3, description: 'Delivered' },
    CANCELED: { value: 4, description: 'Canceled' }
};

export const getStatusDescription = (statusValue) => {
    return Object.values(OrderStatus).find(s => s.value === statusValue)?.description || 'Unknown';
};

export const getStatusValue = (statusDescription) => {
    return Object.values(OrderStatus).find(s => s.description === statusDescription)?.value || 0;
};

export const OrderStatusOptions = Object.values(OrderStatus).map(status => ({
    value: status.description,
    label: status.description
}));