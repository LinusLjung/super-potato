FROM node:latest

LABEL maintainer="Linus Ljung <linus.ljung@outlook.com>"

ENV PROJECT_DIR=/var/www
ENV PORT=3000

EXPOSE ${PORT}

COPY ./tsconfig.json ${PROJECT_DIR}/tsconfig.json
COPY ./src/shared/youtuber ${PROJECT_DIR}/src/shared/youtuber
COPY ./src/youtuber ${PROJECT_DIR}/src/youtuber

WORKDIR ${PROJECT_DIR}/src/youtuber

RUN npm install
RUN npm run build

ENTRYPOINT [ "npm", "start" ]