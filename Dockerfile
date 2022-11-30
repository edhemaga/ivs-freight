FROM node:14.17.6 as build-env
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build-env /app/dist/carrierassist-fe /usr/share/nginx/html