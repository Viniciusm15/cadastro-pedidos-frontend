import { useState } from 'react';

export const usePagination = (initialPage = 0, initialRowsPerPage = 10) => {
    const [pagination, setPagination] = useState({
        page: initialPage,
        rowsPerPage: initialRowsPerPage
    });

    const apiParams = {
        pageNumber: pagination.page + 1,
        pageSize: pagination.rowsPerPage
    };

    const handlePageChange = (event, newPage) => {
        setPagination(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handleRowsPerPageChange = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setPagination({
            page: 0,
            rowsPerPage: newRowsPerPage
        });
    };

    return {
        pagination,
        apiParams,
        handlePageChange,
        handleRowsPerPageChange,
    };
};
