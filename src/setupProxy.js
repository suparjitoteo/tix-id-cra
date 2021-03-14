const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/v1/app/',
    createProxyMiddleware({
      "target": "https://curated.tix.id",
      "changeOrigin": true
    }),
  );
  app.use(
    '/v1',
    createProxyMiddleware({
      "target": "https://api.tix.id",
      "changeOrigin": true
    })
  )
  app.use(
    '/v3',
    createProxyMiddleware({
      "target": "https://api.tix.id",
      "changeOrigin": true
    })
  )
};