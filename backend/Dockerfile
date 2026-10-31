# Construir desde la RAÍZ del repo:
#   docker build -f backend/Dockerfile -t turismo-api .
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
COPY database/package.json database/
RUN npm ci -w backend --include-workspace-root
COPY backend backend
RUN npm run build -w backend

FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
COPY database/package.json database/
RUN npm ci -w backend --include-workspace-root --omit=dev
COPY --from=build /app/backend/dist backend/dist
# El modo memoria (sin DATABASE_URL) necesita los JSON semilla
COPY database/seed database/seed
EXPOSE 3001
CMD ["node", "backend/dist/server.js"]
