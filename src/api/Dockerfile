FROM node:latest

LABEL maintainer="Linus Ljung <linus.ljung@outlook.com>"

ARG SUPER_POTATO_PACKAGE_TOKEN

ENV PROJECT_DIR=/var/www
ENV PORT=3002

EXPOSE ${PORT}

COPY ./tsconfig.json ${PROJECT_DIR}/tsconfig.json
COPY ./src/api ${PROJECT_DIR}/src/api

WORKDIR ${PROJECT_DIR}/src/api

RUN npm install
RUN npm run build

ENTRYPOINT [ "npm", "start" ]
