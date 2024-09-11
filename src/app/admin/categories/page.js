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
    const loadCategories = async () => {
      const { data } = await fetchCategories(1, 10);
      setCategories(data);
    };
    loadCategories();
  }, []);

  const handleCreate = () => {
    setFormState({
      name: "",
      description: "",
    });
    setModalType("create");
    setIsModalOpen(true);
  };

  const handleEdit = async () => {
    if (!selectedRowId) return;
    const selectedRow = categories.find(
      (row) => row.categoryId === selectedRowId,
    );
    setFormState({
      name: selectedRow.name,
      description: selectedRow.description,
    });
    setModalType("edit");
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedRowId) return;
    await deleteCategory(selectedRowId);
    const { data } = await fetchCategories(1, 10);
    setCategories(data);
    setSelectedRowId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRowId(null);
  };

  const handleInputChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalType === "create") {
      await createCategory(formState);
    } else if (modalType === "edit") {
      await updateCategory(selectedRowId, formState);
    }
    setIsModalOpen(false);
    const { data } = await fetchCategories(1, 10);
    setCategories(data);
  };

  return (
    <React.Fragment>
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
      />
      <GenericModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        title={selectedRowId ? "Edit Category" : "Create Category"}
      >
        <GenericForm
          formState={formState}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          fields={[
            { name: "name", label: "Name", type: "text" },
            { name: "description", label: "Description", type: "text" },
          ]}
          submitLabel={selectedRowId ? "Update" : "Create"}
        />
      </GenericModal>
    </React.Fragment>
  );
}
