import styles from '@/components/View/View.module.css';
import Typography from '@mui/material/Typography';

export default function GenericView({ title, items }) {
  return (
    <article className={styles.detailCard}>
      {title && (
        <Typography variant='caption' className={styles.detailLabel}>
          {title}
        </Typography>
      )}
      {items.map((item, index) => (
        <Typography key={index} component='p' className={styles.detailItem}>
          {item.label}: {item.value || 'Not provided'}
        </Typography>
      ))}
    </article>
  );
}
