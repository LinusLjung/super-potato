FROM node:latest

LABEL maintainer="Linus Ljung <linus.ljung@outlook.com>"

ENV PROJECT_DIR=/var/www
ENV PORT=3001

EXPOSE ${PORT}

COPY ./tsconfig.json ${PROJECT_DIR}/tsconfig.json
COPY ./src/packages/super-session ${PROJECT_DIR}/src/packages/super-session
COPY ./src/fronter/server ${PROJECT_DIR}/src/fronter/server

WORKDIR ${PROJECT_DIR}/src/fronter/server

RUN npm --prefix ../../packages/super-session install
RUN npm --prefix ../../packages/super-session run build
RUN npm install
RUN npm run build

ENTRYPOINT [ "npm", "start" ]
