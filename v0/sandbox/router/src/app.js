import express from 'express';
import { createProxyMiddleware } from "http-proxy-middleware"
import { createServer } from 'http';
import { createProxyServer } from 'httpxy';
import { redis } from './config/redis.js';

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

const proxies = {}
const agentProxies = {}

function getPreviewProxy(uuid) {

    const serviceName = `http://sandbox-service-${uuid}`;

    if (!proxies[ uuid ]) {
        proxies[ uuid ] = createProxyMiddleware({
            target: serviceName,
            changeOrigin: true,
            ws: true,
        })
    }

    return proxies[ uuid ]

}

function getAgentProxy(uuid) {

    const serviceName = `http://sandbox-service-${uuid}:8080`;
    if (!agentProxies[ uuid ]) {
        agentProxies[ uuid ] = createProxyMiddleware({
            target: serviceName,
            changeOrigin: true,
            ws: true,
        })
    }

    return agentProxies[ uuid ]

}

app.use(async (req, res, next) => {
    const host = req.host
    const uuid = host.split('.')[ 0 ]
    const isPreview = host.split('.')[ 1 ] === "preview"

    await redis.expire(`sandbox:${uuid}`, 60 * 20)

    return (isPreview ? getPreviewProxy(uuid) : getAgentProxy(uuid))(req, res, next)
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
