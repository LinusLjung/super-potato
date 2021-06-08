FROM node:latest

LABEL maintainer="Linus Ljung <linus.ljung@outlook.com>"

ARG GITHUB_PACKAGE_TOKEN

ENV PROJECT_DIR=/var/www
ENV PORT=3001

EXPOSE ${PORT}

COPY ./tsconfig.json ${PROJECT_DIR}/tsconfig.json
COPY ./src/fronter/server ${PROJECT_DIR}/src/fronter/server

WORKDIR ${PROJECT_DIR}/src/fronter/server

RUN npm install
RUN npm run build

ENTRYPOINT [ "npm", "start" ]
