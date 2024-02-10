FROM node:latest

LABEL maintainer="Linus Ljung <linus.ljung@outlook.com>"

ENV PROJECT_DIR=/var/www
ENV PORT=3001

EXPOSE ${PORT}

COPY ./tsconfig.json ${PROJECT_DIR}/tsconfig.json
COPY ./src/fronter/server ${PROJECT_DIR}/src/fronter/server
COPY ./.github-token.txt ${PROJECT_DIR}/.github-token.txt
COPY ./tools/copy-gh-pat.js ${PROJECT_DIR}/tools/copy-gh-pat.js

WORKDIR ${PROJECT_DIR}/src/fronter/server

RUN node ../../../tools/copy-gh-pat.js src/fronter/server
RUN npm install
RUN npm run build

ENTRYPOINT [ "npm", "start" ]
