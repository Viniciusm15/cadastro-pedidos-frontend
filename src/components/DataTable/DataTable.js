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
    Box
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
}) {
    const paginatedData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
        <Paper className={styles.tableContainer} sx={sx}>
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
                                >
                                    {column.headerName}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className={styles.bodyRow}
                                    hover
                                >
                                    {columns.map((column) => (
                                        <TableCell
                                            key={`${row.id}-${column.field}`}
                                            align={column.align || 'left'}
                                            className={styles.bodyCell}
                                        >
                                            {column.render ? column.render(row) : row[column.field]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    <Box py={4}>
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
                rowsPerPageOptions={[5, 10, 25]}
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
