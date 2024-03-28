import express from 'express';
import http from 'http';
import { router } from './routes';

const app = express();
const server = http.createServer(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '1mb' }));
app.use(router);

let port = process.env.PORT;
if (!port?.length || isNaN(+port)) port = '8080';

server.listen(+port, () => {
    console.log('Server is running on port', port);
});

function close(code: number = 0) {
    server.close(error => {
        if (error) {
            console.error(error);
            process.exit(1);
        }
        process.exit(code);
    });
}

process.on('SIGINT', close);
process.on('SIGTERM', close);

process.on('uncaughtException', (e) => {
    console.error(e);
    close(1);
});

process.on('unhandledRejection', (e) => {
    console.error(e);
    close(1);
});
