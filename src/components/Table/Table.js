import styles from "./Table.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import React from "react";

export default function GenericTable({ headers, data, actions }) {
  return (
    <Table className={styles.table}>
      <TableHead>
        <TableRow>
          {headers.map((header) => (
            <TableCell key={header} className={styles.tableCell}>
              {header}
            </TableCell>
          ))}
          {actions && <TableCell className={styles.tableCell}>Ações</TableCell>}
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
              <TableCell className={styles.actionsCell}>
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
    </Table>
  );
}
