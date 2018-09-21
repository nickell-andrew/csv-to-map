// to use from terminal:
// yarn global add csv-parse
// cd to this directory
// node genVocabMapFromPath.ts <filename in this directory>
let fs = require('fs');
let parse = require('csv-parse');

function objToString(obj, ndeep = 9) {
  if(obj == null){ return String(obj); }
  switch(typeof obj){
    case "string": return '"'+obj+'"';
    case "function": return obj.name || obj.toString();
    case "object":
      var indent = Array(ndeep||1).join('\t'), isArray = Array.isArray(obj);
      return '{['[+isArray] + Object.keys(obj).map(function(key){
           return '\n\t' + indent + key + ': ' + objToString(obj[key], (ndeep||1)+1);
         }).join(',') + '\n' + indent + '}]'[+isArray];
    default: return obj.toString();
  }
}


let inputFile = process.argv[2];
let output = [];
var file = fs.createWriteStream(inputFile.replace('.csv', '.js'));
file.on('error', function(err) {
  /* error handling */
  console.log(err)
});
let parser = parse({ delimitter: '\t' }, (err, data) => {
  file.write('export const newVocab = [\n')
  data.forEach(line => {
    const item = {
      code: line[0],
      name: line[1],
    };
    console.log(item)
    file.write(objToString(item))
    file.write(',\n')
  });
  file.write(']')
  file.end();
});

fs.createReadStream(inputFile).pipe(parser);
