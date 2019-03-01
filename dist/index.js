const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 5000;

console.log('PORT set');

const server = http.createServer((req, res) => {

    console.log('creating server');

    let filePath = path.join(__dirname, '/../', req.url === '/' ? 'index.html' : req.url);

    let extname = path.extname(filePath);

    // Set the content type
    let contentType = 'text/html'; // Default

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
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        default:
            break;
    }

    fs.readFile(filePath, (err, data) => {
        console.log('reading file');
        if (err) {
            // Page not found
            if (err.code == 'ENOENT') {
                console.log('err code == ENOENT');
                fs.readFile(path.join(__dirname, '/../', '404.html'), (err, data) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data, 'utf8');
                });
            } else {
                // Server Error
                console.log('server error');
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }

        } else {
            // No errors
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data, 'utf8');
            console.log('no errors');
        }
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));