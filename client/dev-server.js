const express = require('../server/node_modules/express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from client folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

// API Proxy to Express Backend Server (Port 5000)
const { createProxyMiddleware } = require('../server/node_modules/http-proxy-middleware') || {};

app.use('/api', (req, res) => {
  const http = require('http');
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: `/api${req.url}`,
    method: req.method,
    headers: {
      ...req.headers,
      host: 'localhost:5000',
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    res.status(500).json({ success: false, message: 'Backend proxy error', error: err.message });
  });

  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    req.pipe(proxyReq, { end: true });
  } else {
    proxyReq.end();
  }
});

// Single Page Application (SPA) Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Lost & Found Frontend Web App running at http://localhost:${PORT}`);
  console.log(`📡 Connected to Express Backend API at http://localhost:5000`);
});
