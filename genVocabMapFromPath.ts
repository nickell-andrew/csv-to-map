// to use from terminal:
// yarn global add csv-parse
// cd to this directory
// node genVocabMapFromPath.ts <filename in this directory>
let fs = require('fs');
let parse = require('csv-parse');

let inputFile = process.argv[2];
let output = [];

let parser = parse({ delimitter: '\t' }, (err, data) => {
  data.forEach(line => {
    const item = {
      code: line[0],
      name: line[1],
    };
    output.push(item);
  });
  console.log(output);
});

fs.createReadStream(inputFile).pipe(parser);
