import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);

app.get('/', (_, res) => {
    return res.status(200).send('<h1>Hello World</h1>');
});

let port = process.env.PORT;
if (!port?.length || isNaN(+port)) port = '8080';

server.listen(+port, () => {
    console.log('Server is running on port', port);
});

process.on('SIGINT', () => {
    process.exit(0);
});

process.on('SIGTERM', () => {
    process.exit(0);
});

process.on('uncaughtException', (e) => {
    console.error(e);
    process.exit(0);
});

process.on('unhandledRejection', (e) => {
    console.error(e);
    process.exit(1);
});
