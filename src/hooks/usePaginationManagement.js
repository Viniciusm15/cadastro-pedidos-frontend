import { useState, useMemo } from 'react';

export const usePagination = (initialState = { page: 0, rowsPerPage: 10 }) => {
    const [pagination, setPagination] = useState(initialState);

    const handlePageChange = (_, newPage) => setPagination(prev => ({
        ...prev,
        page: newPage
    }));

    const handleRowsPerPageChange = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setPagination({
            rowsPerPage: newRowsPerPage,
            page: 0
        });
    };

    const apiParams = useMemo(() => ({
        pageNumber: pagination.page + 1,
        pageSize: pagination.rowsPerPage
    }), [pagination.page, pagination.rowsPerPage]);

    return {
        pagination,
        handlePageChange,
        handleRowsPerPageChange,
        apiParams
    };
};
