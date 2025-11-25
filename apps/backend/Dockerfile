# Usar una imagen base de Node.js
FROM node:20-alpine AS development

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los package.json y package-lock.json de la raíz y de los workspaces
# para aprovechar el cache de capas de Docker
COPY package*.json ./
COPY domain/package.json ./domain/
COPY apps/backend/package.json ./apps/backend/

# Instalar todas las dependencias del monorepo
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Establecer el directorio de trabajo específico para el backend
WORKDIR /usr/src/app/apps/backend

# El comando por defecto para correr el backend en modo desarrollo
CMD ["npm", "run", "dev"]
