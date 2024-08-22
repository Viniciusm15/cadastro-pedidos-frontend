import styles from "./Table.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TableFooter,
  TablePagination,
} from "@mui/material";
import React from "react";

export default function GenericTable({
  headers,
  data,
  actions,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) {
  return (
    <Table className={styles.table}>
      <TableHead>
        <TableRow>
          {headers.map((header) => (
            <TableCell key={header} className={styles.tableCell}>
              {header}
            </TableCell>
          ))}
          {actions && (
            <TableCell className={styles.tableCell}>actions</TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {headers.map((header, colIndex) => (
              <TableCell key={colIndex} className={styles.tableCell}>
                {row[header]}
              </TableCell>
            ))}
            {actions && (
              <TableCell>
                {actions.map((action, actionIndex) => (
                  <IconButton
                    key={actionIndex}
                    onClick={() => action.onClick(row)}
                  >
                    {action.icon}
                  </IconButton>
                ))}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            className={styles.tablePagination}
            count={totalCount}
            page={page - 1}
            onPageChange={(event, newPage) => onPageChange(newPage + 1)}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(event) =>
              onPageSizeChange(parseInt(event.target.value, 10))
            }
            sx={{
              ".MuiTablePagination-selectIcon": {
                color: "#ffffff",
              },
            }}
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
}
