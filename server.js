const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { WebSocketServer } = require("ws");
const { setupWSConnection } = require("y-websocket/bin/utils");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

// Define the WebSocket port
const WEBSOCKET_PORT = 1234;

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    // Create a WebSocket server
    const wss = new WebSocketServer({ noServer: true });

    wss.on("connection", (ws, req) => {
        const room = req.url.replace("/", "");
        setupWSConnection(ws, req, { docName: room });
    });

    // Upgrade the server to handle WebSocket connections
    server.on("upgrade", (request, socket, head) => {
        if (request.url.includes("_next/webpack-hmr")) {
            return;
        }

        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request);
        });
    });

    // Start the server to handle HTTP requests
    server.listen(3000, (err) => {
        if (err) throw err;
        console.log("> Ready on http://localhost:3000");
    });

    // Optionally, you can start another server on a different port for WebSocket only
    // if you do not want to integrate it with the existing server.
    // Or simply log that WebSocket is ready (since it's using the same server):
    console.log(`WebSocket server running on ws://localhost:${WEBSOCKET_PORT}`);
});
