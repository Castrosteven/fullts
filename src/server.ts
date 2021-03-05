import express from "express";
const app = express();
const port = 8080; // default port to listen
import WebSocket from 'ws'
const wss = new WebSocket.Server({ port: 4000 });
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('something');
});

// 
import { ScanRouter } from './routes/scanner.routes'
import { WmiRouter } from './routes/wmi.routes'

// define a route handler for the default home page

app.use(ScanRouter)
app.use(WmiRouter)
app.get("/", (req, res) => {
    // render the index template
    res.send('Hello Wor')
});

// start the express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});