"use client";

import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../api/category";
import GenericForm from "../../../components/Form/Form";
import GenericTable from "../../../components/Table/Table";
import styles from "../../../styles/base/pages/categoryManagement.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    id: null,
    isEditing: false,
  });

  useEffect(() => {
    loadCategories(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

  const loadCategories = async (pageNumber, pageSize) => {
    const { data, totalCount } = await fetchCategories(pageNumber, pageSize);
    setCategories(data);
    setTotalCount(totalCount);
};

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formState.isEditing) {
      await updateCategory(formState.id, {
        name: formState.name,
        description: formState.description,
      });
    } else {
      await createCategory({
        name: formState.name,
        description: formState.description,
      });
    }
    loadCategories(pageNumber, pageSize);
    setFormState({ name: "", description: "", id: null, isEditing: false });
  };

  const handleEdit = (category) => {
    setFormState({
      name: category.name,
      description: category.description,
      id: category.categoryId,
      isEditing: true,
    });
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    loadCategories(pageNumber, pageSize);
  };

  return (
    <Box className={styles.container}>
      <GenericForm
        formState={formState}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        fields={[
          { name: "name", label: "Category Name" },
          { name: "description", label: "Description", multiline: true, rows: 4 },
        ]}
        submitLabel={formState.isEditing ? "Update" : "Register"}
      />
      <GenericTable
        headers={["name", "description", "productCount"]}
        data={categories}
        actions={[
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
