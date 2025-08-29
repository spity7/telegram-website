# frontend/Dockerfile

# Stage 1: Build React app
FROM node:18-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

# 👇 Fix OpenSSL issue for webpack/react-scripts
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN yarn build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
