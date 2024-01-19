const http = require('http');
    fs = require('fs'),
    url = require('url');

http.createServer((request, response) => {
    let addr = request.url,
        q = new URL(addr, 'http://' + request.headers.host),
        filepath = '';

        fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Added to log');
            }
        });

        if (q.pathname.includes('documentation')) {
            filepath = (__dirname + '/documentation.html');
        } else {
            filepath = 'index.html';
        }

        fs.readFile(filepath, (err, data) => {
            if (err) {
                throw err;
            } else {
                response.writeHead(200, {'Content-type': 'text/html'});
                response.write(data);
                response.end('');
            }
        });

    
    }).listen(8080);

console.log('My first Node test server is running on port 8080.');