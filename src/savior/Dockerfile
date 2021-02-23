FROM node:latest

LABEL maintainer="Linus Ljung <linus.ljung@outlook.com>"

ENV PROJECT_DIR=/savior

COPY ./tsconfig.json ${PROJECT_DIR}/tsconfig.json
COPY ./src/youtuber/src/constants/Endpoints.ts ${PROJECT_DIR}/src/youtuber/src/constants/Endpoints.ts
COPY ./src/youtuber/src/data-types/Channel.type.ts ${PROJECT_DIR}/src/youtuber/src/data-types/Channel.type.ts
COPY ./src/savior ${PROJECT_DIR}/src/savior

WORKDIR ${PROJECT_DIR}/src/savior

RUN npm install
RUN npm run build

ENTRYPOINT [ "npm", "start" ]