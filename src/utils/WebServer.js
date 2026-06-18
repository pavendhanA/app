const http = require('http');
const fs = require('fs');
const path = require('path');
const logger = require('./Logger');

class WebServer {
  constructor(port = 3000) {
    this.port = port;
    this.server = null;
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        let filePath = path.join(__dirname, '../../web', req.url === '/' ? 'index.html' : req.url);
        
        // Safety check to prevent directory traversal
        const absoluteWebPath = path.resolve(path.join(__dirname, '../../web'));
        const resolvedPath = path.resolve(filePath);
        if (!resolvedPath.startsWith(absoluteWebPath)) {
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          res.end('Forbidden');
          return;
        }

        const extname = path.extname(filePath);
        let contentType = 'text/html';
        switch (extname) {
          case '.js':
            contentType = 'text/javascript';
            break;
          case '.css':
            contentType = 'text/css';
            break;
          case '.json':
            contentType = 'application/json';
            break;
          case '.png':
            contentType = 'image/png';
            break;
          case '.jpg':
            contentType = 'image/jpg';
            break;
        }

        fs.readFile(filePath, (error, content) => {
          if (error) {
            if (error.code === 'ENOENT') {
              res.writeHead(404, { 'Content-Type': 'text/html' });
              res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
              res.writeHead(500);
              res.end(`Server Error: ${error.code}`);
            }
          } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
          }
        });
      });

      this.server.listen(this.port, () => {
        logger.info(`Web server running at http://localhost:${this.port}/`);
        resolve();
      });

      this.server.on('error', (err) => {
        logger.error(`Web server failed to start: ${err.message}`);
        reject(err);
      });
    });
  }

  stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          logger.info('Web server stopped.');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = WebServer;
