# Use Node.js 18 LTS
FROM node:18-alpine

# Instalar dependências do sistema necessárias
RUN apk add --no-cache openssl

# Crie e defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependências
COPY package*.json ./

# Instale todas as dependências (incluindo dev para build)
RUN npm ci

# Copie o código fonte
COPY . .

# Gere o Prisma Client
RUN npx prisma generate

# Compile o TypeScript
RUN npm run build

# Remova dependências de desenvolvimento para reduzir tamanho
RUN npm prune --production

# Exponha a porta
EXPOSE 3000

# Execute as migrações e inicie o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
