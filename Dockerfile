# Imagem Node.js oficial
FROM node:18-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de package para instalar dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia todo o projeto para dentro do container
COPY . .

# Expondo a porta padrão do Next.js
EXPOSE 3000

# Comando para rodar em modo desenvolvimento
CMD ["npm", "run", "dev"]


  git config --global user.name "Your Name"