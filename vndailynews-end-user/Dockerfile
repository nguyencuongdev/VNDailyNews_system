FROM node:14-alpine AS build
WORKDIR /app
COPY ./build .

FROM nginx:stable-alpine
COPY --from=build /app /usr/share/nginx/html
COPY ./docker/config/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]