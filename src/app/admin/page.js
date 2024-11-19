"use client";

import { Typography } from "@mui/material";
import React from "react";

export default function AdminPage() {
  return (
    <React.Fragment>
      <Typography paragraph>
        Dashboard: Visão geral de vendas, produtos em estoque baixo, pedidos
        pendentes, clientes ativos.
      </Typography>
    </React.Fragment>
  );
}
