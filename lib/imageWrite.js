const imageWrite = require('etcher-image-write');
const fs = require('fs');
const imageStream = require('etcher-image-stream');

imageStream.getImageMetadata(process.argv[4]).then((metadata)=>{
    imageStream.getFromFilePath(process.argv[4]).then((image)=>{

        const emitter = imageWrite.write({
            fd: fs.openSync(process.argv[2], 'rs+'), 
                device: process.argv[2],
                size: parseInt(process.argv[3])
            }, {
                stream: image.stream.pipe(image.transform),
                size: metadata.size
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
    });
});