import styles from './ChartContainer.module.css';
import { Paper, Typography, Box } from '@mui/material';
import { LineChart, BarChart } from '@mui/x-charts';

export function GenericChartContainer({ title, type = 'line', series, xAxis, sx = {} }) {
    return (
        <Paper className={styles.container} sx={sx}>
            <Typography variant="h6" className={styles.title}>
                {title}
            </Typography>
            <Box className={styles.chart}>
                {type === 'line' ? (
                    <LineChart series={series} xAxis={xAxis} />
                ) : (
                    <BarChart series={series} xAxis={xAxis} />
                )}
            </Box>
        </Paper>
    );
}
