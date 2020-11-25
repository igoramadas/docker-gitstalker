# GITSTALKER

FROM node:lts-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV GIT_TERMINAL_PROMPT=0
RUN apk update && apk add --no-cache git openssh && npm install shelljs
COPY gitstalker.js .
COPY gitstalker-cron /etc/periodic/15min/

CMD node gitstalker.js && crond -f
