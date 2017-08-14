const imageWrite = require('etcher-image-write');
const fs = require('fs');

const emitter = imageWrite.write({
    fd: fs.openSync(process.argv[2], 'rs+'), 
        device: process.argv[2],
        size: parseInt(process.argv[3])
    }, {
        stream: fs.createReadStream(process.argv[4]),
        size: fs.statSync(process.argv[4]).size
    }, {
        check: false
});
    
emitter.on('progress', (state) => {
    console.log(JSON.stringify(state));
});
      
emitter.on('error', (error) => {
    console.error(error);
});
      
emitter.on('done', (results) => {
    console.log('Success!');
});