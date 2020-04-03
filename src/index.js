require('dotenv-flow').config();

import {app, startApp} from "./app";
import fs from "fs";
import http from "http";
import https from "https";

const port = normalizePort(process.env.PORT);
const useHttps = process.env.HTTPS.toLowerCase() === 'true';
let server;

startApp()
    .then(() => {
        app.set('port', port);

        if (useHttps) {
            let options = {
                key: fs.readFileSync('./keys/key.pem'),
                cert: fs.readFileSync('./keys/cert.pem')
            };
            server = https.createServer(options, app);
            console.log('Created https server');
        } else {
            server = http.createServer(app);
            console.log('Created http server');
        }

        server.listen(port);
        server.on('error', onError);
        server.on('listening', () => {
            const addr = server.address();
            const bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            console.log('Listening on ' + bind);
        });
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) return val; // named pipe
    if (port >= 0) return port; // port number
    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}