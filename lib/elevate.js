const sudo = require('sudo-prompt');
const commandJoin = require('command-join');
const spawn = require('child_process').spawn;
const ipc = require('node-ipc');
const path = require('path');
const options = {
    name: 'BeagleBoot'
    //icns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional) 
};

if(process.getuid()!=0){
    sudo.exec('env ELECTRON_RUN_AS_NODE=1 '+'IPC_SERVER_ID='+process.env.IPC_SERVER_ID+' IPC_CLIENT_ID='+process.env.IPC_CLIENT_ID+' '+commandJoin(process.argv), options,
        function(error, stdout, stderr) {
            if (error) throw error;
        }
    );
}
else{

    ipc.config.id = process.env.IPC_CLIENT_ID;
    ipc.config.silent = true;
    ipc.config.stopRetrying = 0;
    
    ipc.connectTo(process.env.IPC_SERVER_ID, () => {
      //ipc.of[process.env.IPC_SERVER_ID].on('error', reject)
        ipc.of[process.env.IPC_SERVER_ID].on('connect', () => {

            ipc.of[process.env.IPC_SERVER_ID].emit(
                'script',
                {
                    id: ipc.config.id,
                    message: 'send script'
                }
            );

            ipc.of[process.env.IPC_SERVER_ID].on('script', function(data){
                    
                const child = spawn(process.argv0, [path.join(__dirname,data.script), data.device, data.size, data.img], {
                    env:{
                        ELECTRON_RUN_AS_NODE: 1
                    }
                });

                child.stdout.on('data', (data) => {
                    ipc.of[process.env.IPC_SERVER_ID].emit('message', `${data}`);
                });

                child.stderr.on('data', (data) => {
                    ipc.of[process.env.IPC_SERVER_ID].emit('message', `${data}`);
                });

                ipc.of[process.env.IPC_SERVER_ID].on('disconnect', child.kill.bind(child));
                
            });
        });
    });
}