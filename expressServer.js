const express = require('express');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 8000
const petsPath = path.join(__dirname, 'pets.JSON');

let app = express()

fs.readFile(petsPath, 'utf8', (err, petsData) => {
  let parsedPets = JSON.parse(petsData)
  app.get('/pets', (req, res) => {

  // console.log("IN IT /pets");
  res.send(parsedPets);
  })
  app.get('/pets/:id', (req, res) => {
    let id = req.params.id
    // console.log(id);
    // console.log(req.params.id);
    if(!isNaN(id) && id >= 0 && id < parsedPets.length) {
      res.send(parsedPets[id])
    }
    else {
      res.set('Content-Type', 'text/plain');
      res.sendStatus(404);

    }
  })
})
// app.listen(8000)

module.exports = app
