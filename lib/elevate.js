const sudo = require('sudo-prompt');
const commandJoin = require('command-join');
const childProcess = require('child_process');
const ipc = require('node-ipc');
const path = require('path');
const platform = require('os').platform();
const options = {
    name: 'BeagleBoot'
    //icns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional) 
};
var child; 

if(!isSudo()){
    sudo.exec('env ELECTRON_RUN_AS_NODE=1 '+'IPC_SERVER_ID='+process.env.IPC_SERVER_ID+' IPC_CLIENT_ID='+process.env.IPC_CLIENT_ID+' '+commandJoin(process.argv), options,
        function(error, stdout, stderr) {
            if (error) console.log(error.message);
        }
    );
}
else{

    ipc.config.id = process.env.IPC_CLIENT_ID;
    ipc.config.silent = true;
    ipc.config.stopRetrying = 0;
    
    ipc.connectTo(process.env.IPC_SERVER_ID, () => {
        ipc.of[process.env.IPC_SERVER_ID].on('connect', () => {

            ipc.of[process.env.IPC_SERVER_ID].emit(
                'script',
                {
                    id: ipc.config.id
                }
            );

            ipc.of[process.env.IPC_SERVER_ID].on('script', function(data){

                if (child) child.kill();
                    
                child = childProcess.spawn(process.argv0, [path.join(__dirname,data.script), data.device, data.size, data.img], {
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

                ipc.of[process.env.IPC_SERVER_ID].on('killChild', ()=>{
                    child.kill();
                });

                // Kill Child Process and elevated script server disconnect (App exit)
                ipc.of[process.env.IPC_SERVER_ID].on('disconnect', appExit.bind(appExit));
                
            });
        });
    });
}

function appExit(){
    child.kill();
    process.exit();
}

// Check sudo access
function isSudo(){
    if(platform === 'win32'){
        const isAdmin = new Promise((resolve, reject)=>{
            childProcess.exec('fltmc');
        }); 
        isAdmin.then(()=>{return true;})
        .catch(()=>{return false;});
    }

    // For UNIX, su id is 0
    else return process.getuid() === 0;
}