"use client";

import { fetchCategories } from "../../../api/category";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../api/product";
import GenericDataGrid from "../../../components/DataGrid/DataGrid";
import GenericFileUploadButton from "../../../components/FileUploadButton/FileUploadButton";
import GenericForm from "../../../components/Form/Form";
import GenericModal from "../../../components/Modal/Modal";
import GenericSelect from "../../../components/Select/Select";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import React, { useState, useEffect } from "react";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    categoryId: "",
    image: null,
  });

  useEffect(() => {
    fetchProducts(1, 10).then(({ data }) => setProducts(data));
    fetchCategories(1, 10).then(({ data }) => setCategories(data));
  }, []);

  const handleOpenModal = (
    type,
    row = {
      name: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      categoryId: "",
      image: null,
    },
  ) => {
    setFormState(row);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCreate = () => handleOpenModal("create");

  const handleEdit = () => {
    if (selectedRowId) {
      const selectedRow = products.find(
        ({ productId }) => productId === selectedRowId,
      );
      if (selectedRow) {
        handleOpenModal("edit", selectedRow);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedRowId) {
      await deleteProduct(selectedRowId);
      fetchProducts(1, 10).then(({ data }) => {
        setProducts(data);
        setSelectedRowId(null);
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRowId(null);
    setFormState({
      name: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      categoryId: "",
      image: null,
    });
  };

  const handleInputChange = ({ target: { name, value } }) =>
    setFormState((prev) => ({ ...prev, [name]: value }));

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];

      setFormState((prev) => ({
        ...prev,
        image: {
          description: file.name,
          imageMimeType: file.type,
          imageData: base64String,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form state:", formState); // Verifique os dados aqui
    if (modalType === "create") {
      await createProduct(formState);
    } else if (modalType === "edit") {
      await updateProduct(selectedRowId, formState);
    }
    setIsModalOpen(false);
    fetchProducts(1, 10).then(({ data }) => setProducts(data));
  };

  return (
    <React.Fragment>
      <GenericDataGrid
        rows={products.map((product) => ({
          id: product.productId,
          categoryName:
            categories.find((cat) => cat.categoryId === product.categoryId)
              ?.name || "N/A",
          ...product,
        }))}
        columns={[
          { field: "name", headerName: "Name", width: 150 },
          { field: "description", headerName: "Description", width: 200 },
          { field: "price", headerName: "Price", width: 100 },
          { field: "stockQuantity", headerName: "Stock Quantity", width: 150 },
          { field: "categoryName", headerName: "Category", width: 150 },
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
        handleClose={handleCloseModal}
        title={modalType === "edit" ? "Edit Product" : "Create Product"}
      >
        <GenericForm
          formState={formState}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          fields={[
            { name: "name", label: "Name", type: "text" },
            { name: "description", label: "Description", type: "text" },
            { name: "price", label: "Price", type: "number" },
            { name: "stockQuantity", label: "Stock Quantity", type: "number" },
          ]}
          additionalFields={
            <React.Fragment>
              <GenericSelect
                label="Category"
                name="categoryId"
                value={formState.categoryId}
                onChange={handleInputChange}
                options={categories.map((category) => ({
                  value: category.categoryId,
                  label: category.name,
                }))}
              />
              <GenericFileUploadButton
                onUpload={handleFileUpload}
                accept="image/*"
                buttonText="Upload Product Image"
              />
            </React.Fragment>
          }
          submitLabel={modalType === "edit" ? "Update" : "Create"}
        />
      </GenericModal>
    </React.Fragment>
  );
}
