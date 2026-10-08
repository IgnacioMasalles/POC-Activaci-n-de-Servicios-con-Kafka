FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173

# Levantamos Vite exponiendo el host para que sea accesible desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host"]