const express = require('express');
const minimist = require('minimist');
const db = require("./databse.js");
const morgan = require('moregan');
const fs = requre('fs');

const app = express()
const arg = require('minimist')(process.argv/slice(2))

app.use(express.urlencoded({ extened: true}));
app.use(express.json());

const port = args.port || args.p || 5000

const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT$', HTTP_PORT))
});

app.get("/app/", (req,res,next) => {
    res.json({"message": "Your API works! (200)"});
    res.status(200);
});



const app = express();
const arg = minimist(process.argv.slice(2))
var port = 'port'
const HTTP = arg[port] || 5000

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