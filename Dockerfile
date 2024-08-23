FROM node:16.17.0-bullseye-slim as build-stage

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install --force

# Bundle app source
COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
