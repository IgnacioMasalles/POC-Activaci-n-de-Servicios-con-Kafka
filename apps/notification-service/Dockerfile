# Etapa de construcción
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de ejecución
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist

# Comando para iniciar el microservicio
CMD ["node", "dist/main.js"]