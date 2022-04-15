const express = require('express');
const minimist = require('minimist');
const db = require("./databse.js");
const morgan = require('moregan');
const fs = requre('fs');

const app = express()
const arg = require('minimist')(process.argv/slice(2))

app.use(express.urlencoded({ extened: true}));
app.use(express.json());

const port = arg.port || arg.p || 5000

const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT$', HTTP_PORT))
});

app.get("/app/", (req,res,next) => {
    res.json({"message": "Your API works! (200)"});
    res.status(200);
});
if(args.log == 'true'){
    const access = fs.createWriteStream('access.log', {
        flags: 'a'
    }) 
    app.use(morgan('combined', {stream: access}))
}
else {
    console.log("NOTICE: not creating file acces.log");
}

const help = (`
server.js [options]
--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.
--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.
--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.
--help	Return this message and exit.
`)
app.use( (req, res, next) => {
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
    }
    console.log(logdata)
    const stmt = db.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const info = stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method, logdata.url, logdata.protocol, logdata.httpversion, logdata.status, logdata.referer, logdata.useragent)
    next();
  });

const server = app.listen(HTTP, () => {
  console.log("App listening on port %PORT%".replace('%PORT%', HTTP))
});

app.get('/app/', (req, res) => {
      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
      res.end(res.statusCode+ ' ' +res.statusMessage)
    });

app.get('/app/flip', (req, res) => {
    res.status(200)
    res.type('text/plain')
    res.json({'flip': coinFlip()})
})

app.get('/app/flips/:number', (req, res) => {
    res.status(200)
    var flipsArray = coinFlips(req.params.number)
    res.json({'raw': flipsArray, 'summary': countFlips(flipsArray)})
})

app.get('/app/flip/call/heads', (req, res) => {
    res.status(200)
    res.json(flipACoin("heads"))
})

app.get('/app/flip/call/tails', (req, res) => {
    res.status(200)
    res.json(flipACoin("tails"))
})

app.use(function(req, res){
  res.status(404).send('404 NOT FOUND')
  res.type('text/plain')
});