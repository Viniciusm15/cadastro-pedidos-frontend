"use client";

import { Typography } from "@mui/material";
import React from "react";

export default function Orders() {
  return (
    <React.Fragment>
      <Typography paragraph>
        Gerenciamento de Pedidos: Listagem de pedidos com filtros (status, data,
        cliente). Detalhes do pedido, incluindo itens, cliente e status.
        Atualização de status do pedido. Geração de relatórios de vendas.
      </Typography>
    </React.Fragment>
  );
}
