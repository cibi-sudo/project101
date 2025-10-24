import { WebSocketServer } from 'ws';
import {verifyToken} from "@repo/auth";

const wss = new WebSocketServer({ port: 8080 });


wss.on('connection', function connection(ws,request) {
    const url = request.url ?? "";
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = verifyToken(token);

    if (userId == null) {
        ws.close()
        return null;
    }
});