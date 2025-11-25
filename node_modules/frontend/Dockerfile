# Usar una imagen base de Node.js
FROM node:20-alpine AS development

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los package.json y package-lock.json para aprovechar el cache
COPY package*.json ./
COPY apps/frontend/package.json ./apps/frontend/

# Instalar las dependencias
# Nota: No copiamos 'domain' aquí porque el frontend no parece depender directamente de él.
# Si lo hiciera, habría que añadir: COPY domain/package.json ./domain/
RUN npm install

# Copiar el resto del código fuente del frontend y archivos de configuración relevantes
COPY apps/frontend/ ./apps/frontend/
COPY angular.json .
COPY tsconfig.json .

# Establecer el directorio de trabajo específico para el frontend
WORKDIR /usr/src/app/apps/frontend

# Exponer el puerto de Angular
EXPOSE 4200

# Correr el servidor de desarrollo de Angular
# El --host 0.0.0.0 es necesario para que sea accesible desde fuera del container
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
