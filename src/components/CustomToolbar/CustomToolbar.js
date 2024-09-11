import styles from "./CustomToolbar.module.css";
import { GridToolbarContainer } from "@mui/x-data-grid";

export default function CustomToolbar({ actions = [], selectedRowId }) {
  return (
    <GridToolbarContainer className={styles.customToolbar}>
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={styles.toolbarButton}
          disabled={action.needsSelection && !selectedRowId}
        >
          {action.icon} {action.label}
        </button>
      ))}
    </GridToolbarContainer>
  );
}
