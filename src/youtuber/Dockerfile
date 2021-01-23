FROM node:latest

LABEL maintainer="Linus Ljung <linus.ljung@outlook.com>"

ENV PROJECT_DIR=/var/www
ENV PORT=3000

EXPOSE ${PORT}

COPY . ${PROJECT_DIR}

WORKDIR ${PROJECT_DIR}

RUN npm install
RUN npm run build

ENTRYPOINT [ "npm", "start" ]