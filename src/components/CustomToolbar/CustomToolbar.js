import styles from "./CustomToolbar.module.css";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { GridToolbarContainer } from "@mui/x-data-grid";

export default function CustomToolbar({
  handleCreate,
  handleEdit,
  handleDelete,
  selectedRowId,
}) {
  return (
    <GridToolbarContainer className={styles.customToolbar}>
      <button onClick={handleCreate} className={styles.toolbarButton}>
        <EditIcon /> Create
      </button>
      <button
        onClick={handleEdit}
        className={styles.toolbarButton}
        disabled={!selectedRowId}
      >
        <EditIcon /> Edit
      </button>
      <button
        onClick={handleDelete}
        className={styles.toolbarButton}
        disabled={!selectedRowId}
      >
        <DeleteIcon /> Delete
      </button>
    </GridToolbarContainer>
  );
}
