# GITSTALKER

FROM node:lts-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV GIT_TERMINAL_PROMPT=0

COPY gitstalker-repos.js .
COPY gitstalker-backup.js .
COPY cron-repos /etc/periodic/15min/
COPY cron-backup /etc/periodic/15min/

RUN apk update && apk add --no-cache git openssh && \
    chmod +x /etc/periodic/15min/cron-repos && \
    chmod +x /etc/periodic/15min/cron-backup && \
    npm install bent shelljs --production --no-save --loglevel=error

CMD crond -f
