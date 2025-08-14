'use client';

import React from 'react';
import { useDashboardManagement } from '@/hooks/useDashboardManagement';
import { GenericActionButton } from '@/components/ActionButton/ActionButton';
import { GenericDataTable } from '@/components/DataTable/DataTable';
import { GenericDialog } from '@/components/Dialog/Dialog';
import { GenericChartContainer } from '@/components/ChartContainer/ChartContainer';
import { GenericMetricCard } from '@/components/MetricCard/MetricCard';
import { GenericSnackbar } from '@/components/SnackBar/SnackBar';
import { GenericStatusChip } from '@/components/StatusChip/StatusChip';
import {
  Box,
  Chip,
  Grid,
  Typography,
  TextField
} from '@mui/material';
import { AttachMoney, ProductionQuantityLimits, Inventory, PendingActions, People, Refresh } from '@mui/icons-material';

export default function Dashboard() {
  const {
    metrics,
    salesData,
    lowStockProducts,
    pendingOrders,
    customersData,
    refreshData,
    restockModal,
    openRestockModal,
    closeRestockModal,
    handleRestockSubmit,
    handleQuantityChange,
    snackbar,
    closeSnackbar,
    lowStockPagination,
    pendingOrdersPagination
  } = useDashboardManagement();

  const getLowStockColumns = () => [
    { field: 'name', headerName: 'Product', width: '30%' },
    {
      field: 'stock',
      headerName: 'Stock',
      align: 'right',
      width: '20%',
      render: (row) => {
        return (
          <Chip
            label={`${row.stock} units`}
            color='error'
            size="small"
          />
        );
      },
    },
    { field: 'category', headerName: 'Category', width: '30%' },
    {
      field: 'actions',
      headerName: 'Actions',
      align: 'right',
      width: '20%',
      render: (row) => (
        <GenericActionButton
          icon={<ProductionQuantityLimits fontSize="small" />}
          tooltip="Restock product"
          onClick={() => openRestockModal(row.id, row.name, row.stock)}
          color="primary"
        />
      )
    }
  ];

  const getPendingOrdersColumns = () => [
    { field: 'id', headerName: 'Order', width: '20%' },
    {
      field: 'customer',
      headerName: 'Customer',
      width: '30%',
      maxLength: 30,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      align: 'right',
      width: '20%',
      render: (row) => `R$ ${row.amount.toLocaleString('pt-BR')}`
    },
    {
      field: 'status',
      headerName: 'Status',
      width: '30%',
      render: (row) => <GenericStatusChip status={row.status} label={row.status} />
    }
  ];

  return (
    <Box className="dashboard-container">
      <Grid container spacing={3} className="metrics-grid">
        <Grid item xs={12} sm={6} lg={3}>
          <GenericMetricCard
            title="Sales"
            value={metrics?.totalSales}
            icon={<AttachMoney color="primary" />}
            change={metrics?.salesChange}
            isCurrency
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <GenericMetricCard
            title="Low Stock"
            value={metrics?.lowStockProductsCount}
            icon={<Inventory color="warning" />}
            description="Products with less than 10 units"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <GenericMetricCard
            title="Pending Orders"
            value={metrics?.pendingOrdersCount}
            icon={<PendingActions color="info" />}
            description="Awaiting processing"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <GenericMetricCard
            title="Active Customers"
            value={metrics?.activeCustomersCount}
            icon={<People color="success" />}
            description={`+${metrics?.newCustomersThisMonth} this month`}
          />
        </Grid>
      </Grid>

      <GenericChartContainer
        title="Sales Trend (Last 7 Days)"
        series={[{
          data: salesData.data || [],
          area: true,
          label: 'Amount in R$'
        }]}
        xAxis={[{
          scaleType: 'point',
          data: salesData.labels || [],
          label: 'Week Days'
        }]}
      />

      <Grid container spacing={4} className="tables-grid">
        <Grid item xs={12} lg={6}>
          <GenericDataTable
            title="Low Stock Products"
            maxTextLength={30}
            columns={getLowStockColumns()}
            data={lowStockProducts.data}
            totalCount={lowStockProducts.totalCount}
            page={lowStockPagination.pagination.page}
            rowsPerPage={lowStockPagination.pagination.rowsPerPage}
            onPageChange={lowStockPagination.handlePageChange}
            onRowsPerPageChange={lowStockPagination.handleRowsPerPageChange}
            actionButtons={[
              <GenericActionButton
                key="refresh-products"
                icon={<Refresh fontSize="small" />}
                tooltip="Refresh list"
                onClick={refreshData}
              />
            ]}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <GenericDataTable
            title="Pending Orders"
            maxTextLength={30}
            columns={getPendingOrdersColumns()}
            data={pendingOrders.data}
            totalCount={pendingOrders.totalCount}
            page={pendingOrdersPagination.pagination.page}
            rowsPerPage={pendingOrdersPagination.pagination.rowsPerPage}
            onPageChange={pendingOrdersPagination.handlePageChange}
            onRowsPerPageChange={pendingOrdersPagination.handleRowsPerPageChange}
            actionButtons={[
              <GenericActionButton
                key="refresh-orders"
                icon={<Refresh fontSize="small" />}
                tooltip="Refresh orders"
                onClick={refreshData}
              />
            ]}
          />
        </Grid>
      </Grid>

      <GenericChartContainer
        title="Monthly Customer Growth"
        type="bar"
        series={[{
          data: customersData.monthlyData || [],
          label: 'New customers'
        }]}
        xAxis={[{
          scaleType: 'band',
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          label: 'Month'
        }]}
      />

      <GenericDialog
        open={restockModal.open}
        onClose={closeRestockModal}
        title={`Restock Product: ${restockModal.productName}`}
        content={
          <React.Fragment>
            <Typography variant="body1" gutterBottom>
              Current stock: {restockModal.currentStock} units
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Quantity to add"
              type="number"
              fullWidth
              value={restockModal.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
              inputProps={{ min: 1 }}
            />
          </React.Fragment>
        }
        primaryButtonText="Confirm Restock"
        secondaryButtonText="Cancel"
        onPrimaryButtonClick={handleRestockSubmit}
        onSecondaryButtonClick={closeRestockModal}
        primaryButtonDisabled={restockModal.quantity <= 0}
      />
      <GenericSnackbar
        open={snackbar.open}
        onClose={closeSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
}
