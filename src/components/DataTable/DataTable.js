import styles from './DataTable.module.css';
import React from 'react';
import {
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TablePagination,
    Box,
    Tooltip
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';

export function GenericDataTable({
    title,
    columns,
    data = [],
    totalCount = 0,
    page = 0,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    actionButtons = [],
    sx = {},
    maxTextLength = 50,
    selectedRowId,
    setSelectedRowId,
    rowIdField = 'id'
}) {
    const handleRowClick = (row) => {
        const id = row[rowIdField];
        if (setSelectedRowId) {
            setSelectedRowId(id);
        }
    };

    const SmartTableCell = ({ value, column, maxLength }) => {
        if (typeof value !== 'string') return value;

        const needsTruncation = value.length > maxLength;
        const displayValue = needsTruncation ? `${value.substring(0, maxLength)}...` : value;

        return needsTruncation ? (
            <Tooltip title={value} arrow enterDelay={500}>
                <div className={styles.truncatedCell}>
                    {displayValue}
                </div>
            </Tooltip>
        ) : (
            <div className={styles.normalCell}>
                {displayValue}
            </div>
        );
    };

    return (
        <Paper className={styles.tableContainer} sx={{
            ...sx,
            '& .MuiTableBody-root': {
                '& .MuiTableCell-root': {
                    padding: '15px',
                }
            }
        }}>
            <div className={styles.header}>
                <Typography variant="h6" className={styles.title}>{title}</Typography>
                <div className={styles.actions}>
                    {actionButtons}
                    <IconButton size="small" className={styles.moreButton}>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>

            <TableContainer className={styles.tableWrapper}>
                <Table size="small" stickyHeader className={styles.table}>
                    <TableHead>
                        <TableRow className={styles.headerRow}>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.field}
                                    align={column.align || 'left'}
                                    className={styles.headerCell}
                                    width={column.width}
                                    sx={column.sx}
                                >
                                    {column.headerName}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((row) => (
                                <TableRow
                                    key={row[rowIdField]}
                                    className={`${styles.bodyRow} ${selectedRowId === row[rowIdField] ? styles.selected : ''}`}
                                    hover
                                    onClick={() => handleRowClick(row)}
                                >
                                    {columns.map((column) => (
                                        <TableCell
                                            key={`${row[rowIdField]}-${column.field}`}
                                            align={column.align || 'left'}
                                            className={styles.bodyCell}
                                            sx={column.cellSx}
                                        >
                                            {column.render ? column.render(row) : (
                                                <SmartTableCell
                                                    value={row[column.field]}
                                                    column={column}
                                                    maxLength={column.maxLength || maxTextLength}
                                                />
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    <Box className={styles.emptyState}>
                                        <Typography variant="body2" color="textSecondary">
                                            No data available
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                className={styles.pagination}
                rowsPerPageOptions={[5, 10]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
            />
        </Paper>
    );
}
