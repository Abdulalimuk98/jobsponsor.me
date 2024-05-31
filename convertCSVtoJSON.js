const csvtojson = require('csvtojson');
const fs = require('fs');

csvtojson()
  .fromFile('./static/latest.csv') // path to your CSV file
  .then(jsonData => {
    fs.writeFileSync('./src/screens/SearchPage/latest.json', JSON.stringify(jsonData, null, 2)); // path to output JSON file
  });