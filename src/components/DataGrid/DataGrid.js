import CustomToolbar from "../CustomToolbar/CustomToolbar";
import styles from "./DataGrid.module.css";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";

export default function GenericDataGrid({
  rows,
  columns,
  pageSizeOptions,
  selectedRowId,
  setSelectedRowId,
  additionalActions = [],
  sx,
}) {
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);

  return (
    <DataGrid
      className={styles.dataGrid}
      rows={rows}
      columns={columns}
      pagination
      pageSize={pageSize}
      onPageSizeChange={(newSize) => setPageSize(newSize)}
      rowSelectionModel={selectedRowId ? [selectedRowId] : []}
      onRowSelectionModelChange={(newSelection) => {
        setSelectedRowId(newSelection.length ? newSelection[0] : null);
      }}
      slots={{
        toolbar: () => (
          <CustomToolbar
            actions={additionalActions}
            selectedRowId={selectedRowId}
          />
        ),
      }}
      sx={{
        "& .MuiDataGrid-container--top [role='row'], & .MuiDataGrid-container--bottom [role='row']":
          {
            backgroundColor: "#121212",
          },
        "& .MuiDataGrid-iconButtonContainer": {
          color: "#fff",
        },
        "& .MuiTablePagination-root": {
          color: "#fff",
        },
        "& .MuiTablePagination-selectIcon": {
          color: "#fff",
        },
        "& .MuiTablePagination-actions .MuiSvgIcon-root": {
          color: "#fff",
        },
        "& .MuiDataGrid-menuIconButton": {
          color: "#fff",
        },
        "& .MuiDataGrid-sortIcon": {
          color: "#fff",
        },
        "& .MuiTablePagination-root .MuiSvgIcon-root": {
          color: "#fff",
        },
        "& .MuiSelect-icon": {
          color: "white",
        },
        ...sx,
      }}
    />
  );
}
