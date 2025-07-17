import styles from './MetricCard.module.css';
import { Paper, Stack, Typography } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

export function GenericMetricCard({ title, value, icon, change, description, isCurrency = false }) {
  return (
    <Paper className={styles.card} sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" color="text.secondary">{title}</Typography>
        <div className={styles.icon} style={{ color: icon.props.color }}>
          {icon}
        </div>
      </Stack>
      <Typography variant="h4" className={styles.value} sx={{ mt: 1 }}>
        {isCurrency ? 'R$ ' : ''}{value?.toLocaleString('pt-BR') || '0'}
      </Typography>
      {change !== undefined && (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {change > 0 ? (
            <ArrowUpward color="success" />
          ) : (
            <ArrowDownward color="error" />
          )}
          <Typography variant="body2" color={change > 0 ? 'success.main' : 'error.main'}>
            {change}% em relação ao mês passado
          </Typography>
        </Stack>
      )}
      {description && (
        <Typography variant="body2" className={styles.description} color="text.secondary">
          {description}
        </Typography>
      )}
    </Paper>
  );
}
