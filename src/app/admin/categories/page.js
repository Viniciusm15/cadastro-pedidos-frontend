"use client";

import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../api/category";
import Box from "../../../components/Box/Box";
import GenericForm from "../../../components/Form/Form";
import GenericTable from "../../../components/Table/Table";
import styles from "../../../styles/base/pages/categoryManagement.module.css";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";

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
    const loadCategories = async () => {
      const { data, totalCount } = await fetchCategories(pageNumber, pageSize);
      setCategories(data);
      setTotalCount(totalCount);
    };
    loadCategories();
  }, [pageNumber, pageSize]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = formState.isEditing ? updateCategory : createCategory;
    await action(formState.id, {
      name: formState.name,
      description: formState.description,
    });
    setFormState({ name: "", description: "", id: null, isEditing: false });
    const { data, totalCount } = await fetchCategories(pageNumber, pageSize);
    setCategories(data);
    setTotalCount(totalCount);
  };

  const handleEdit = (category) =>
    setFormState({ ...category, id: category.categoryId, isEditing: true });
  const handleDelete = async (id) => {
    await deleteCategory(id);
    const { data, totalCount } = await fetchCategories(pageNumber, pageSize);
    setCategories(data);
    setTotalCount(totalCount);
  };

  return (
    <Box>
      <GenericForm
        formState={formState}
        handleInputChange={(e) =>
          setFormState({ ...formState, [e.target.name]: e.target.value })
        }
        handleSubmit={handleSubmit}
        fields={[
          { name: "name", label: "Category Name" },
          {
            name: "description",
            label: "Description",
            multiline: true,
            rows: 4,
          },
        ]}
        submitLabel={formState.isEditing ? "Update" : "Register"}
      />
      <GenericTable
        headers={["name", "description", "productCount"]}
        data={categories}
        actions={[
          {
            icon: <EditIcon className={styles.whiteIcon} />,
            onClick: handleEdit,
          },
          {
            icon: <DeleteIcon className={styles.whiteIcon} />,
            onClick: handleDelete,
          },
        ]}
        page={pageNumber}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPageNumber}
        onPageSizeChange={(newSize) => setPageSize(newSize)}
      />
    </Box>
  );
}
