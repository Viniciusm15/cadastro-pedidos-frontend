import styles from '@/components/Header/Header.module.css';
import Typography from '@mui/material/Typography';

export default function GenericHeader({ title, count }) {
  return (
    <header className={styles.sectionHeader}>
      <Typography variant='h6' className={styles.sectionTitle}>
        {title}
      </Typography>
      {count !== undefined && `${count} items`}
    </header>
  );
}
