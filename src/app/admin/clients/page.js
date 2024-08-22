"use client";

import {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
} from "../../../api/client";
import Box from "../../../components/Box/Box";
import GenericForm from "../../../components/Form/Form";
import GenericTable from "../../../components/Table/Table";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";

export default function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    telephone: "",
    birthDate: dayjs(),
    id: null,
    isEditing: false,
  });

  useEffect(() => {
    loadClients(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

  const loadClients = async (pageNumber, pageSize) => {
    const { data, totalCount } = await fetchClients(pageNumber, pageSize);
    setClients(data);
    setTotalCount(totalCount);
  };

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  function handleDateChange(fieldName, date) {
    const newDate = dayjs(date);
    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: newDate,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = formState.birthDate
      ? formState.birthDate.format("YYYY-MM-DD")
      : null;

    if (formState.isEditing) {
      await updateClient(formState.id, {
        name: formState.name,
        email: formState.email,
        telephone: formState.telephone,
        birthDate: formattedDate,
      });
    } else {
      await createClient({
        name: formState.name,
        email: formState.email,
        telephone: formState.telephone,
        birthDate: formattedDate,
      });
    }
    loadClients(pageNumber, pageSize);
    setFormState({
      name: "",
      email: "",
      telephone: "",
      birthDate: null,
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
    loadClients(pageNumber, pageSize);
  };

  const handleViewPurchaseHistory = (client) => {
    console.log("Histórico de compras do cliente:", client);
    // Implementar a lógica para exibir os detalhes, como um modal.
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
            icon: <VisibilityIcon sx={{ color: "#ffffff" }} />,
            onClick: handleViewPurchaseHistory,
          },
          { icon: <EditIcon sx={{ color: "#ffffff" }} />, onClick: handleEdit },
          {
            icon: <DeleteIcon sx={{ color: "#ffffff" }} />,
            onClick: handleDelete,
          },
        ]}
        page={pageNumber}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPageNumber}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNumber(1);
        }}
      />
    </Box>
  );
}
