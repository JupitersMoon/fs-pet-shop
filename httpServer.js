'use strict';

const fs = require('fs');
const http = require('http');
const url = require('url');
const port = 8000;

const server = http.createServer((req, res) => {
  fs.readFile('./pets.json', 'utf8', (err, data) => {
    // console.log(req.url);
    if (err) throw err;
    let pathName = url.parse(req.url).pathname; // '/pets/1'
    let method = req.method;
    let body = req.body;
    // console.log(req);
    // console.log(body);
    let pathArr = pathName.match(/[^/]+/g); // ['pets', '1']
    if (method === 'GET') {
      if (!pathArr) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found')
      } else if (pathArr[0] === 'pets') {
        if (pathArr.length === 1) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(data)
        } else if (JSON.parse(data)[pathArr[1]]) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(JSON.parse(data)[pathArr[1]]));
        } else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Not Found')
        }
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found')
      }
    } else if (method === 'POST') {
      req.on('data', (newPet) => {
        let parsed = JSON.parse(newPet);
        if (pathArr.length === 0) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Not Found')
        } else if (parsed.age && !isNaN(parsed.age) && parsed.kind && parsed.name) {
          // console.log(data);
          let writer = (JSON.parse(data));
          writer.push(parsed);
          writer = JSON.stringify(writer);
          // console.log(writer);
          fs.writeFile('./pets.json', writer, (writeErr) => {
            if (writeErr) throw writeErr;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(newPet);
          })
        } else {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Bad Request')
        }
      })
    }
  });
});

module.exports = server
