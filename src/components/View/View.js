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
        <div key={index} className={styles.detailItem}>
          <Typography component='span'>{item.label}:</Typography>
          {item.value || <Typography component='span'>Not provided</Typography>}
        </div>
      ))}
    </article>
  );
}
