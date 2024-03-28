FROM alpine
RUN apk add --no-cache --update nodejs npm

WORKDIR /app
COPY ./backend/package.json package-lock.json ./
RUN npm install --omit=dev
COPY ./backend/ ./

CMD ["node", "dist/index.js"]
