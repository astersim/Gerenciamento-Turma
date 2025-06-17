# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copie os arquivos de dependências
COPY package*.json ./

# Instale as dependências
RUN npm ci

# Copie o código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Production stage
FROM nginx:alpine

# Copie os arquivos build para o nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copie configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponha a porta
EXPOSE 80

# Inicie o nginx
CMD ["nginx", "-g", "daemon off;"]
