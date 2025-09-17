FROM node:24-alpine as dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --include=dev --legacy-peer-deps
RUN npm install -g @angular/cli@20

FROM dependencies as build
ARG SOURCE_VERSION=UNSPECIFIED
ARG SOURCE_COMMIT=UNSPECIFIED
ENV SOURCE_VERSION=${SOURCE_VERSION} \
    SOURCE_COMMIT=${SOURCE_COMMIT} \
    ENVCFG=./src/app/config.ts
COPY . .
RUN sed -i "s/__SOURCE_VERSION__/${SOURCE_VERSION}/g" ${ENVCFG}
RUN sed -i "s/__SOURCE_COMMIT__/${SOURCE_COMMIT}/g" ${ENVCFG}
RUN ng build --optimization --configuration=production

FROM nginx:1.29-alpine-slim
ENV LANG=ru_RU.UTF-8 \
    HTTP_PORT=80 \
    NGINX_PATH=/usr/share/nginx/html
COPY --from=build /app/dist/control/browser/* ${NGINX_PATH}/
RUN mkdir -p ${NGINX_PATH}/assets
RUN mv ${NGINX_PATH}/bootstrap-5.1.3 ${NGINX_PATH}/assets/
RUN mv ${NGINX_PATH}/env_config.js ${NGINX_PATH}/assets/
COPY docker-entrypoint.sh /opt/
COPY nginx.conf /etc/nginx/nginx.conf
RUN chmod +x /opt/docker-entrypoint.sh
ENTRYPOINT ["/opt/docker-entrypoint.sh"]
EXPOSE ${HTTP_PORT}
