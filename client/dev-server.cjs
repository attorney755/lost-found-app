const express = require('../server/node_modules/express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Serve static assets from client and public directories
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Proxy API requests to Express Backend Server (Port 5000)
app.use('/api', (req, res) => {
  const http = require('http');
  const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: `/api${req.url}`,
    method: req.method,
    headers: {
      ...req.headers,
      host: '127.0.0.1:5000',
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

app.listen(PORT, HOST, () => {
  console.log(`🌐 Lost & Found Web Application is live at http://localhost:${PORT}`);
  console.log(`📡 Backend API proxying to http://127.0.0.1:5000`);
});
