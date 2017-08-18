console.log(JSON.stringify({description: 'Connect board by holding down S2 switch. If process gets stuck for long, press the on board RESET switch', complete: 0}));

var BB = require('beagle-boot');

var emitter = BB.usbMassStorage();

emitter.on('progress', function(status){
    console.log(JSON.stringify(status));
});

emitter.on('done', function(){
    console.log(JSON.stringify({description:'Transfer Done, Ready for flashing in a bit..', complete: 100}));
});

emitter.on('error', function(error){
    console.log(JSON.stringify({umsError: error.toString()}));
});

emitter.on('connect', function(device){
    if(device === 'UMS') console.log(JSON.stringify({done: 'Ready for Flashing!'}));
});

emitter.on('disconnect', function(device){
    if(device === 'UMS') console.log(JSON.stringify({disconnect: 'USB Mass Storage device disconnected. Try again!'}));
});
