FROM node:latest

LABEL maintainer="Linus Ljung <linus.ljung@outlook.com>"

ENV PROJECT_DIR=/savior

COPY ./tsconfig.json ${PROJECT_DIR}/tsconfig.json
COPY ./src/shared/youtuber ${PROJECT_DIR}/src/shared/youtuber
COPY ./src/savior ${PROJECT_DIR}/src/savior

WORKDIR ${PROJECT_DIR}/src/savior

RUN npm install
RUN npm run build

ENTRYPOINT [ "npm", "start" ]