"use client";

import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../api/category";
import GenericDataGrid from "../../../components/DataGrid/DataGrid";
import GenericForm from "../../../components/Form/Form";
import GenericModal from "../../../components/Modal/Modal";
import React, { useState, useEffect } from "react";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    productCount: 0,
  });

  useEffect(() => {
    fetchCategories(1, 10).then(({ data }) => setCategories(data));
  }, []);

  const handleOpenModal = (type, row = { name: "", description: "" }) => {
    setFormState(row);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCreate = () => handleOpenModal("create");

  const handleEdit = () => {
    console.log("Selected Row ID:", selectedRowId);
    if (selectedRowId) {
      const selectedRow = categories.find(
        ({ categoryId }) => categoryId === selectedRowId,
      );
      if (selectedRow) {
        handleOpenModal("edit", selectedRow);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedRowId) {
      await deleteCategory(selectedRowId);
      fetchCategories(1, 10).then(({ data }) => {
        setCategories(data);
        setSelectedRowId(null);
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRowId(null);
  };

  const handleInputChange = ({ target: { name, value } }) =>
    setFormState((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalType === "create") {
      await createCategory(formState);
    } else if (modalType === "edit") {
      await updateCategory(selectedRowId, formState);
    }
    setIsModalOpen(false);
    fetchCategories(1, 10).then(({ data }) => setCategories(data));
  };

  return (
    <>
      <GenericDataGrid
        rows={categories.map((category) => ({
          id: category.categoryId,
          ...category,
        }))}
        columns={[
          { field: "name", headerName: "Name", width: 150 },
          { field: "description", headerName: "Description", width: 200 },
          { field: "productCount", headerName: "Product Count", width: 150 },
        ]}
        pageSizeOptions={[10, 25, 50]}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        setSelectedRowId={setSelectedRowId}
        selectedRowId={selectedRowId}
      />
      <GenericModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        title={modalType === "edit" ? "Edit Category" : "Create Category"}
      >
        <GenericForm
          formState={formState}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          fields={[
            { name: "name", label: "Name", type: "text" },
            { name: "description", label: "Description", type: "text" },
          ]}
          submitLabel={modalType === "edit" ? "Update" : "Create"}
        />
      </GenericModal>
    </>
  );
}
