import express from 'express';
import { createProxyMiddleware } from "http-proxy-middleware"
import { createServer } from 'http';
import { createProxyServer } from 'httpxy';

const app = express();


app.get("/_status/healthz", (req, res) => {
    res.status(200).json({
        status: "ok"
    })
})

app.get("/_status/readyz", (req, res) => {
    res.status(200).json({
        status: "ok"
    })
})

app.use((req, res, next) => {
    const host = req.host
    const uuid = host.split('.')[ 0 ]
    const serviceName = "http://sandbox-service-" + uuid

    console.log(serviceName)

    return createProxyMiddleware({
        target: serviceName,
        changeOrigin: true,
        ws: true,
    })(req, res, next)
})

const wsProxy = createProxyServer({
    changeOrigin: true,
})
const server = createServer(app)

server.on('upgrade', (req, socket, head) => {
    const host = req.headers.host
    const uuid = host.split('.')[ 0 ]
    const serviceName = "http://sandbox-service-" + uuid

    wsProxy.ws(req, socket, { target: serviceName }, head)
        .catch(() => socket.destroy());
})

export default app;
