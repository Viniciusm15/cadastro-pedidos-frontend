"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    id: null,
    isEditing: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/api/Category`,
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias", error);
    }
  };

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formState.isEditing) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACK_END_URL}/api/Category/${formState.id}`,
          {
            name: formState.name,
            description: formState.description,
          },
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACK_END_URL}/api/Category`,
          {
            name: formState.name,
            description: formState.description,
          },
        );
      }
      fetchCategories();
      setFormState({ name: "", description: "", id: null, isEditing: false });
    } catch (error) {
      console.error("Erro ao salvar categoria", error);
    }
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
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/api/Category/${id}`,
      );
      fetchCategories();
    } catch (error) {
      console.error("Erro ao deletar categoria", error);
    }
  };

  return (
    <Box
      sx={{ padding: "20px", backgroundColor: "#121212", borderRadius: "8px" }}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Nome da Categoria"
          value={formState.name}
          onChange={handleInputChange}
          fullWidth
          InputLabelProps={{
            style: { color: "#ffffff" },
          }}
          InputProps={{
            style: { color: "#ffffff", backgroundColor: "#333333" },
          }}
        />
        <TextField
          name="description"
          label="Descrição"
          value={formState.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
          InputLabelProps={{
            style: { color: "#ffffff" },
          }}
          InputProps={{
            style: { color: "#ffffff", backgroundColor: "#333333" },
          }}
          sx={{ marginTop: "10px" }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: "10px" }}
        >
          {formState.isEditing ? "Atualizar" : "Cadastrar"}
        </Button>
      </form>

      <Table sx={{ marginTop: "20px" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "#ffffff" }}>Nome</TableCell>
            <TableCell sx={{ color: "#ffffff" }}>Descrição</TableCell>
            <TableCell sx={{ color: "#ffffff" }}>
              Quantidade de Produtos
            </TableCell>
            <TableCell sx={{ color: "#ffffff" }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.categoryId}>
              <TableCell sx={{ color: "#ffffff" }}>{category.name}</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>
                {category.description}
              </TableCell>
              <TableCell sx={{ color: "#ffffff" }}>
                {category.productCount}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(category)}>
                  <EditIcon sx={{ color: "#ffffff" }} />
                </IconButton>
                <IconButton onClick={() => handleDelete(category.categoryId)}>
                  <DeleteIcon sx={{ color: "#ffffff" }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
