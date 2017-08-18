const imageWrite = require('etcher-image-write');
const fs = require('fs');
const imageStream = require('etcher-image-stream');
const device = process.argv[2];
const size = process.argv[3];
const imageUrl = process.argv[4];

imageStream.getImageMetadata(imageUrl).then((metadata)=>{
    imageStream.getFromFilePath(imageUrl).then((image)=>{

        const emitter = imageWrite.write({
            fd: fs.openSync(device, 'rs+'), 
                device: device,
                size: parseInt(size)
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
            console.error(JSON.stringify({writeError: error.toString()}));
        });
            
        emitter.on('done', (results) => {
            console.log(JSON.stringify({success: 'Flashing complete'}));
        });
    });
});