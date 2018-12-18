var http = require('http');
var fs = require('fs');
const db = require('./DBConnection');

const getResponse = (response, contentType, fileURL) => {
    response.writeHead(200, { 'Content-type': contentType });
    fs.readFile(fileURL, (err, html) => {
        if (err) {
            throw err;
        }
        response.write(html);
        response.end();
    });
}

http.createServer(function (request, response) {
    var activeUsers=[];
var sayings = new Map();
    let fileName = './login.html';
    let filetype = 'text/html'
    if (request.url.includes(".html")) {
        fileName = `.${request.url}`;
    } else if (request.url.includes(".css")) {
        fileName = `.${request.url}`;
        filetype = 'text/css';
    } else if (request.url.includes(".js")) {
        fileName = `.${request.url}`;
        filetype = 'text/javascript';
    }
    switch (request.url) {
        case '/chat':
            console.log("in register case");
            response.writeHead(200, { 'Content-type': 'application/json' });
            request.on('data', (data) => {
                let registerData = JSON.parse(data)
                response.write(data);
                response.end();
            });
            break;
        case '/valReq': response.writeHead(200, { 'Content-type': 'text/javascript' });
            request.on('data', (data) => {
                let queryData = JSON.parse(data);
                db.selectStatement(queryData.username, (result) => {
                    let res = "Failed";
                    if (result[0] != undefined) {
                        let pass = result[0].password;
                        if (queryData.password.toString() == pass) {
                            res = "success";
                            activeUsers.push(queryData.username);
                        }
                    }
                    response.write(res);
                    response.end();

                });
            });
            break;
        default:
            getResponse(response, filetype, fileName);
    }
}).listen(8080);