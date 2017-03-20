'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const morgan = require('morgan');
const port = process.env.PORT || 8000;

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.get('/pets', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
    if (err) {
      // console.error(err.stack);
      return res.sendStatus(500);
    }
    res.set('Content-Type', 'application/json')
    res.send(petsJSON);
  });
});

app.get('/pets/:id', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
    if (err) {
      // console.error(err.stack);
      return res.sendStatus(500);
    }
    let id = Number.parseInt(req.params.id);
    let pets = JSON.parse(petsJSON);
    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      return res.sendStatus(404);
    }
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(pets[id]));
  });
});

app.post('/pets', (req, res) => {
  let name = req.body.name
  let age = req.body.age
  let kind = req.body.kind
  if (!name || !age || !kind) {
    res.sendStatus(400)
  } else {
    let newPet = {
      "name": name,
      "age": age,
      "kind": kind
    }
    fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
      if (err) {
        // console.error(err.stack);
        return res.sendStatus(500);
      }
      let pets = JSON.parse(petsJSON)
      pets.push(req.body)
      petsJSON = JSON.stringify(pets)
      fs.writeFile(petsPath, petsJSON, (err) => {
        if (err) throw error;
        res.send((req.body))
      })
    })
    console.log('reqbody final', (req.body), typeof req.body);
  }
})
app.patch('/pets/:id', (req, res) => {
  let name = req.body.name
  let age = req.body.age
  let kind = req.body.kind

  if (!name && (!age || typeof age !== 'number') && !kind) {
    res.sendStatus(400)
  } else {
    fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
      if (err) {
        console.error(err.stack);
        return res.sendStatus(500);
      }
      let pets = JSON.parse(petsJSON)
      if (name) pets[req.params.id].name = name;
      if (age && typeof age === 'number') pets[req.params.id].age = age;
      if (kind) pets[req.params.id].kind = kind;

      petsJSON = JSON.stringify(pets)
      fs.writeFile(petsPath, petsJSON, (err) => {
        if (err) throw error;
        res.send(pets[req.params.id])
      })
    })
  }
})

app.delete('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    let pets = JSON.parse(petsJSON)
    let byebye = pets.splice(req.params.id, 1)
    petsJSON = JSON.stringify(pets)
    fs.writeFile(petsPath, petsJSON, (err) => {
      if (err) throw error;
      res.send(byebye[0])
    })
  })
})
app.use(function(req, res) {
  res.sendStatus(404);
});

app.listen(port, function() {
  console.log('Listening on port', port);
});

module.exports = app;
