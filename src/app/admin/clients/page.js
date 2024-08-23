"use client";

import {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
} from "../../../api/client";
import Box from "../../../components/Box/Box";
import GenericForm from "../../../components/Form/Form";
import GenericList from "../../../components/List/List";
import GenericModal from "../../../components/Modal/Modal";
import GenericTable from "../../../components/Table/Table";
import styles from "../../../styles/base/pages/clientManagement.module.css";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";

export default function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
  });
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    telephone: "",
    birthDate: dayjs(),
    id: null,
    isEditing: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const loadClients = async () => {
      const { data, totalCount } = await fetchClients(
        pagination.pageNumber,
        pagination.pageSize,
      );
      setClients(data);
      setPagination((prev) => ({ ...prev, totalCount }));
    };
    loadClients();
  }, [pagination.pageNumber, pagination.pageSize]);

  const handleInputChange = (e) =>
    setFormState({ ...formState, [e.target.name]: e.target.value });

  const handleDateChange = (fieldName, date) => {
    setFormState((prevState) => ({ ...prevState, [fieldName]: dayjs(date) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = formState.birthDate?.format("YYYY-MM-DD");
    const clientData = { ...formState, birthDate: formattedDate };

    formState.isEditing
      ? await updateClient(formState.id, clientData)
      : await createClient(clientData);

    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
    setFormState({
      name: "",
      email: "",
      telephone: "",
      birthDate: dayjs(),
      id: null,
      isEditing: false,
    });
  };

  const handleEdit = (client) => {
    setFormState({
      name: client.name,
      email: client.email,
      telephone: client.telephone,
      birthDate: dayjs(client.birthDate),
      id: client.clientId,
      isEditing: true,
    });
  };

  const handleDelete = async (id) => {
    await deleteClient(id);
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  };

  const handleViewPurchaseHistory = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  return (
    <Box>
      <GenericForm
        formState={formState}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handleDateChange={handleDateChange}
        fields={[
          { name: "name", label: "Client Name" },
          { name: "email", label: "Email" },
          { name: "telephone", label: "Telephone" },
          { name: "birthDate", label: "Birth Date", type: "date" },
        ]}
        submitLabel={formState.isEditing ? "Update" : "Register"}
      />
      <GenericTable
        headers={["name", "email", "telephone", "birthDate"]}
        data={clients}
        actions={[
          {
            icon: <Visibility className={styles.whiteIcon} />,
            onClick: handleViewPurchaseHistory,
          },
          { icon: <Edit className={styles.whiteIcon} />, onClick: handleEdit },
          {
            icon: <Delete className={styles.whiteIcon} />,
            onClick: handleDelete,
          },
        ]}
        page={pagination.pageNumber}
        pageSize={pagination.pageSize}
        totalCount={pagination.totalCount}
        onPageChange={(newPage) =>
          setPagination((prev) => ({ ...prev, pageNumber: newPage }))
        }
        onPageSizeChange={(newSize) =>
          setPagination({ pageSize: newSize, pageNumber: 1 })
        }
      />
      {selectedClient && (
        <GenericModal
          open={isModalOpen}
          handleClose={handleCloseModal}
          title="Purchase History"
        >
          <Typography>Nome: {selectedClient.name}</Typography>
          <Typography>Email: {selectedClient.email}</Typography>
          <GenericList
            items={selectedClient.purchaseHistory}
            primaryText={(purchase) => `Order ID: ${purchase.orderId}`}
            secondaryText={(purchase) => (
              <React.Fragment>
                <Typography component="span" className={styles.purchaseDate}>
                  Order Date: {dayjs(purchase.orderDate).format("MM/DD/YYYY")}
                </Typography>
                <Typography component="span" className={styles.totalValue}>
                  Total Value:{" "}
                  {purchase.totalValue.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </Typography>
              </React.Fragment>
            )}
            emptyMessage="No purchase history available"
          />
        </GenericModal>
      )}
    </Box>
  );
}
