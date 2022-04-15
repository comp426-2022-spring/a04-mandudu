const express = require('express');
const app = express();

const db = require("./database.js");
const morgan = require('morgan');
const fs = require('fs');

const args = require('minimist')(process.argv/slice(2))

app.use(express.urlencoded({ extened: true}));
app.use(express.json());

const port = args.port || process.env.port || 5000

const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT$', HTTP_PORT))
});

app.get("/app/", (req,res,next) => {
    res.statusMessage = "Your API works!";
    res.statusCode = 200;
    res.writeHead(res.statusCode, {'Content-Type' : 'text/plain'})
    res.end(res.statusCode + ' ' + res.statusMessage);
});

if(args.log == 'false'){
    console.log("NOTICE: not creating file acces.log");
}
else {
    const access = fs.createWriteStream('access.log', {
        flags: 'a'
    }) 
    app.use(morgan('combined', {stream: access}))
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

if(args.help || args.h){
    console.log(help);
    process.exit(0);
}

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

  if ((args.debug == true) || (args.d == true)) {
    app.get('/app/log/access', (req, res, next) => {
      const statement = db.prepare('SELECT * FROM accesslog').all();
      res.status(200).json(statement);
  });

  app.get('/app/error', (req, res, next) => {
    throw new Error('Successful: Error.')
  })
}
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


function coinFlip() {
    let random = Math.floor(Math.random()*2);
    if(random ==1) {
      return "heads";
    }
    return "tails";
  }
  
  /** Multiple coin flips
   * 
   * Write a function that accepts one parameter (number of flips) and returns an array of 
   * resulting "heads" or "tails".
   * 
   * @param {number} flips 
   * @returns {string[]} results
   * 
   * example: coinFlips(10)
   * returns:
   *  [
        'heads', 'heads',
        'heads', 'tails',
        'heads', 'tails',
        'tails', 'heads',
        'tails', 'heads'
      ]
   */
  
  function coinFlips(flips) {
    let x = [];
  
    for(let i =0; i<flips; i++) {
      x.push(coinFlip());
    }
    return x;
  }
  
  /** Count multiple flips
   * 
   * Write a function that accepts an array consisting of "heads" or "tails" 
   * (e.g. the results of your `coinFlips()` function) and counts each, returning 
   * an object containing the number of each.
   * 
   * example: conutFlips(['heads', 'heads','heads', 'tails','heads', 'tails','tails', 'heads','tails', 'heads'])
   * { tails: 5, heads: 5 }
   * 
   * @param {string[]} array 
   * @returns {{ heads: number, tails: number }}
   */
  
  function countFlips(array) {
     let tailNum = 0;
     let headNum = 0;
  
     for(let i = 0; i< array.length; i++) {
       if(array[i] == "heads"){
         headNum += 1;
       }else {
         tailNum += 1;
       }
     }
     if (headNum ==0) {
       return {
         tails: tailNum
       };
     }
     if (tailNum ==0) {
       return {
         heads: headNum,
       };
     }
     return {
       tails: tailNum,
       heads: headNum
     };
  }
  
  /** Flip a coin!
   * 
   * Write a function that accepts one input parameter: a string either "heads" or "tails", flips a coin, and then records "win" or "lose". 
   * 
   * @param {string} call 
   * @returns {object} with keys that are the input param (heads or tails), a flip (heads or tails), and the result (win or lose). See below example.
   * 
   * example: flipACoin('tails')
   * returns: { call: 'tails', flip: 'heads', result: 'lose' }
   */
  
  function flipACoin(call) {
     let flip = coinFlip();
     let result = "win";
     
     if(flip != call){
       result = "lose";
     }
  
     const returnSum = {
       call: call,
       flip: flip,
       result: result
     }
     return returnSum;
  }
