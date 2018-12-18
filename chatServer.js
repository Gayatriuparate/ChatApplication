var http = require('http');
var fs = require('fs');

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
var activeUsers = [];
var sayings = new Map();


http.createServer(function (request, response) {

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
        case '/user':
            response.writeHead(200, { 'Content-type': 'application/json' });
            request.on('data', (data) => {

                response.write(JSON.stringify(activeUsers));
                response.end();
            });
            break;
        case '/chat':

            response.writeHead(200, { 'Content-type': 'application/json' });

            request.on('data', (data) => {
                let info = JSON.parse(data);
                console.log("t2 after click  "+info.loginuser)
                let mymap = sayings.get(info.loginuser);
                if (mymap.has(info.u_name)) {
                    mymap.get(info.u_name).push(info.msg);
                }
                else {

                    let a = [];
                    a.push(info.msg);
                    console.log("xdcvbvcxcvbvcxcv    " + info.u_name);
                    mymap.set(info.u_name, a);
                    console.log("in user111  " + mymap.get(info.u_name));

                }
                // console.log("in uesr  "+ mymap);
                //console.log("sayings  "+sayings.get(info.loginuser).get(info.u_name));
                console.log("sayings  " + sayings.get(info.loginuser).get(info.u_name));

                // mymap.set()
                response.write("drftyhuihthyt");
                response.end();
            });
            break;
        case '/valReq':
            console.log("in val req");
            response.writeHead(200, { 'Content-type': 'text/javascript' });
            request.on('data', (data) => {
                let queryData = JSON.parse(data);
                activeUsers.push(queryData.username);
                let mymap = new Map();
                // sayings.set(queryData.username, mymap);
                console.log("t2    "+queryData.username);
                sayings.set(queryData.username, mymap);

                response.write("success");
                response.end();

                // db.selectStatement(queryData.username, (result) => {
                //     let res = "Failed";
                //     if (result[0] != undefined) {
                //         let pass = result[0].password;
                //         if (queryData.password.toString() == pass) {
                //             res = "success";
                //             activeUsers.push(queryData.username);
                //         }
                //     }
                //     response.write(res);
                //     response.end();

                // });
            });
            break;
        default:
            getResponse(response, filetype, fileName);
    }
}).listen(8080);