import CustomToolbar from "../CustomToolbar/CustomToolbar";
import styles from "./DataGrid.module.css";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";

export default function GenericDataGrid({
  rows,
  columns,
  pageSizeOptions,
  handleCreate,
  handleEdit,
  handleDelete,
  sx,
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [selectedRowId, setSelectedRowId] = useState(null);

  return (
    <DataGrid
      className={styles.dataGrid}
      rows={rows}
      columns={columns}
      pagination
      pageSize={pageSize}
      onPageChange={(params) => setPageNumber(params.page)}
      onPageSizeChange={(params) => setPageSize(params.pageSize)}
      rowSelectionModel={selectedRowId ? [selectedRowId] : []}
      onRowSelectionModelChange={(newSelection) => {
        setSelectedRowId(newSelection.length > 0 ? newSelection[0] : null);
      }}
      slots={{
        toolbar: () => (
          <CustomToolbar
            handleCreate={handleCreate}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
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
