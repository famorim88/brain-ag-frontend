FROM node:18-alpine AS build

WORKDIR /app
COPY package.json yarn.lock* package-lock.json* ./
RUN npm install --frozen-lockfile # Use --frozen-lockfile para builds consistentes, ou yarn install --frozen-lockfile
COPY . .
RUN npm run build # Este comando cria a pasta 'build' com os arquivos estáticos
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80