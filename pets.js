const fs = require('fs');
const path = require('path');
const pets = 'pets.json';

let args = process.argv;

if (args[2] === 'create') {
  if (args.length < 7 && args.length > 3 && !isNaN(args[3]) && args[3] > 0 && typeof args[4] === 'string' && typeof args[5] === 'string') {
    fs.readFile(pets, (err, data) => {
      let animals = JSON.parse(data);
      let newPet = {
        age: parseInt(args[3]),
        kind: args[4],
        name: args[5]
      };
      animals.push(newPet);
      let animJSON = JSON.stringify(animals);
      fs.writeFile(pets, animJSON, (writeErr) => {
        if (writeErr) {
          throw writeErr;
        }
        console.log(newPet);
      })
    })
  } else {
    console.error("Usage: node pets.js create AGE KIND NAME");
    process.exit(1)
  }
} else if (args[2] === 'read') {
  fs.readFile(pets, (err, data) => {
    if (err) {
      throw err;
    } else if (args.length === 3) {
      console.log(JSON.parse(data));
    } else if (args.length === 4 && !isNaN(args[3]) && args[3] >= 0 && args[3] < JSON.parse(data).length) {
      console.log(JSON.parse(data)[args[3]]);
    } else {
      console.error("Usage: node pets.js read INDEX");
      process.exit(1);
    }
  })
} else if (args[2] === 'update') {
  fs.readFile(pets, (err, data) => {
    let animals = JSON.parse(data);
    if (args.length === 7 && args[3] > 0 && args[3] < animals.length) {
      let newPet = {
        age: parseInt(args[4]),
        kind: args[5],
        name: args[6]
      };
      animals[args[3]] = newPet;
      let animJSON = JSON.stringify(animals);
      fs.writeFile(pets, animJSON, (writeErr) => {
        if (writeErr) {
          throw writeErr;
        }
        console.log(newPet);
      })
    } else {
      console.error("Usage: node pets.js update INDEX AGE KIND NAME");
      process.exit(1);
    }
  })

} else if (args[2] === 'destroy') {
  fs.readFile(pets, (err, data) => {
    let animals = JSON.parse(data);
    if (args.length === 4 && !isNaN(args[3]) && args[3] > 0 && args[3] < animals.length) {
      let killed = animals.splice([args[3]], 1);
      let animJSON = JSON.stringify(animals);
      fs.writeFile(pets, animJSON, (writeErr) => {
        if (writeErr) {
          throw writeErr;
        }
        console.log(killed[0]);
      })
    }
    else {
      console.error("Usage: node pets.js destroy INDEX");
      process.exit(1);
    }
  })
} else {
  console.error("Usage: node pets.js [read | create | update | destroy]");
  process.exit(1);
}
