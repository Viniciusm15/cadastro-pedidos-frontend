"use client";

import { fetchClients } from "../../../api/client";
import {
  fetchOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../../../api/order";
import GenericDataGrid from "../../../components/DataGrid/DataGrid";
import GenericForm from "../../../components/Form/Form";
import GenericModal from "../../../components/Modal/Modal";
import GenericSelect from "../../../components/Select/Select";
import GenericDatePicker from "@/components/DatePicker/DatePicker";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formState, setFormState] = useState({
    clientId: "",
    orderDate: dayjs(),
    totalValue: 0,
  });

  useEffect(() => {
    fetchClients().then(({ data }) => setClients(data));
    fetchOrders().then(({ data }) => setOrders(data));
  }, []);

  const openModal = (type, row = {}) => {
    setFormState(row);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCreate = () => openModal("create");

  const handleEdit = () => {
    const selectedOrder = orders.find(
      ({ orderId }) => orderId === selectedRowId,
    );
    if (selectedOrder) {
      setFormState(selectedOrder);
      openModal("edit", selectedOrder);
    }
  };

  const handleDelete = async () => {
    if (selectedRowId) {
      await deleteOrder(selectedRowId);
      setOrders((prev) =>
        prev.filter(({ orderId }) => orderId !== selectedRowId),
      );
      setSelectedRowId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRowId(null);
  };

  const handleInputChange = ({ target: { name, value } }) =>
    setFormState((prev) => ({ ...prev, [name]: value }));

  const handleDateChange = (date) =>
    setFormState((prevState) => ({ ...prevState, orderDate: dayjs(date) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      ...formState,
      orderDate: formState.orderDate.format("YYYY-MM-DD"),
    };

    if (modalType === "create") {
      await createOrder(orderData);
    } else if (modalType === "edit") {
      await updateOrder(selectedRowId, orderData);
    }
    closeModal();
    fetchOrders().then(({ data }) => setOrders(data));
  };

  return (
    <React.Fragment>
      <GenericDataGrid
        rows={orders.map((order) => ({
          id: order.orderId,
          clientName:
            clients.find((client) => client.clientId === order.clientId)
              ?.name || "N/A",
          ...order,
        }))}
        columns={[
          { field: "clientName", headerName: "Client", width: 150 },
          {
            field: "orderDate",
            headerName: "Order Date",
            width: 150,
            valueFormatter: (params) =>
              dayjs(params.value).format("MM/DD/YYYY"),
          },
          {
            field: "totalValue",
            headerName: "Total Value",
            width: 150,
          },
        ]}
        pageSizeOptions={[10, 25, 50]}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        setSelectedRowId={setSelectedRowId}
        selectedRowId={selectedRowId}
        additionalActions={[
          { label: "Create", icon: <EditIcon />, onClick: handleCreate },
          {
            label: "Edit",
            icon: <EditIcon />,
            onClick: handleEdit,
            needsSelection: true,
          },
          {
            label: "Delete",
            icon: <DeleteIcon />,
            onClick: handleDelete,
            needsSelection: true,
          },
        ]}
      />
      <GenericModal
        open={isModalOpen}
        handleClose={closeModal}
        title={modalType === "edit" ? "Edit Order" : "Create Order"}
      >
        <GenericForm
          formState={formState}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
          handleSubmit={handleSubmit}
          fields={[
            {
              name: "totalValue",
              label: "Total Value",
              type: "number",
            },
          ]}
          additionalFields={
            <React.Fragment>
              <GenericDatePicker
                label="Order Date"
                value={formState.orderDate}
                onChange={handleDateChange}
              />
              <GenericSelect
                label="Client"
                name="clientId"
                value={formState.clientId}
                onChange={handleInputChange}
                options={clients.map((client) => ({
                  value: client.clientId,
                  label: client.name,
                }))}
              />
            </React.Fragment>
          }
          submitLabel={modalType === "edit" ? "Update" : "Create"}
        />
      </GenericModal>
    </React.Fragment>
  );
}
