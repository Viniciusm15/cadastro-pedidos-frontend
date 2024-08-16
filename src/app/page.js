import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React from "react";

function Home() {
  return (
    <Container maxWidth="lg" sx={{ minHeight: "100vh", padding: "16px" }}>
      <Container maxWidth="md">
        <Typography variant="h3" align="center" gutterBottom>
          {/* Conteúdo da página principal do E-commerce */}
        </Typography>
      </Container>
    </Container>
  );
}

export default Home;
