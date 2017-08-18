const React = require('react');
const app = window.require('electron').remote; 
const dialog = app.dialog;
const fork = window.require('child_process').fork;
const sudo = window.require('sudo-prompt');
const ipc = window.require('node-ipc');
const fs = window.require('fs');
const drivelist = window.require('drivelist');
const path = window.require('path');

// React Components
import Block from './Block';
import MainPage from './mainPage';
import Settings from './settings';
import About from './about';

// StyleSheets
require('../../css/main.css');
require('../../css/nav.css');


var IPCserverStarted;   // Promise, returns socket on resolution
var imagePath;

// Main App
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            progress: {
                value: 0,
                infoText: 'Go ahead! click USB Mass Storage button to begin'
            },
            buttonState: {
                ums: true,
                img: false,
                flash: false
            },
            isIPCserverOn: false,
            window: 'main'
        };
        this.settingsClick = this.settingsClick.bind(this);
        this.mainClick = this.mainClick.bind(this);
        this.aboutClick = this.aboutClick.bind(this);
        this.umsClick = this.umsClick.bind(this);
        this.selectImage = this.selectImage.bind(this);
        this.writeImage = this.writeImage.bind(this);

        // IPC Server
        window.process.env.IPC_SERVER_ID = `BB-server-${window.process.pid}`;
        window.process.env.IPC_CLIENT_ID = `BB-client-${window.process.pid}`;

        ipc.config.id = window.process.env.IPC_SERVER_ID;
        ipc.config.silent = true;
        ipc.serve();

        // On receiving stdout and stderr from elevated process
        ipc.server.on('message', function(data){
            console.log(data);
            try{
                var status = JSON.parse(data);

                // For usbMassStorage script progress
                if(status.description) this.setState((prevState)=>{
                    return {
                        progress: {
                            value: status.complete,
                            infoText: status.description
                        },
                        buttonState:{
                            ums: prevState.buttonState.ums,
                            img: prevState.buttonState.img,
                            flash: prevState.buttonState.flash
                        },
                        isIPCserverOn: prevState.isIPCserverOn,
                        window: prevState.window
                    }
                });
                
                // After emmc mount
                if(status.done) {
                    this.setState((prevState)=>{
                        return {
                            progress: {
                                value: 0,
                                infoText: 'Select Image for flashing'
                            },
                            buttonState:{
                                ums: false,
                                img: true,
                                flash: false
                            },
                            isIPCserverOn: prevState.isIPCserverOn,
                            window: prevState.window
                        }
                    });

                    // Kill Child Process that spwans usbMassStorage script
                    IPCserverStarted.then(function(socket){
                        ipc.server.emit(socket, 'killChild', {});
                    });
                }
    
                // For imageWrite script progress
                if(status.type)this.setState((prevState)=>{
                    return {
                        progress: {
                            value: status.percentage,
                            infoText: 'Writing Image => Percentage: '+status.percentage.toFixed(2)+'%  ---- Speed: '+(status.speed/(1024*1024)).toFixed(2)+'MB/s ---- ETA: '+Math.floor(status.eta/60)+' min.'
                        },
                        buttonState:{
                            ums: false,
                            img: false,
                            flash: false
                        },
                        isIPCserverOn: prevState.isIPCserverOn,
                        window: prevState.window
                    }
                });
            }
            catch(e){ }
            
        }.bind(this));
    }

    settingsClick(){
        this.setState((prevState)=>{
                return {
                    progress: {
                        value: prevState.progress.value,
                        infoText: prevState.progress.infoText
                    },
                    buttonState:{
                        ums: prevState.buttonState.ums,
                        img: prevState.buttonState.img,
                        flash: prevState.buttonState.flash
                    },
                    isIPCserverOn: prevState.isIPCserverOn,
                    window: 'settings'
                }
            });
    }

    mainClick(){
        this.setState((prevState)=>{
                return {
                    progress: {
                        value: prevState.progress.value,
                        infoText: prevState.progress.infoText
                    },
                    buttonState:{
                        ums: prevState.buttonState.ums,
                        img: prevState.buttonState.img,
                        flash: prevState.buttonState.flash
                    },
                    isIPCserverOn: prevState.isIPCserverOn,
                    window: 'main'
                }
            });
    }

    aboutClick(){
        this.setState((prevState)=>{
                return {
                    progress: {
                        value: prevState.progress.value,
                        infoText: prevState.progress.infoText
                    },
                    buttonState:{
                        ums: prevState.buttonState.ums,
                        img: prevState.buttonState.img,
                        flash: prevState.buttonState.flash
                    },
                    isIPCserverOn: prevState.isIPCserverOn,
                    window: 'about'
                }
            });
    }

    umsClick(){
        // Promise, starts IPC server and returns socket for client on resolution
        if(!this.state.isIPCserverOn) IPCserverStarted = new Promise((resolve, reject)=>{

            ipc.server.on('start', () => {

                this.setState((prevState)=>{
                    return {
                        progress: {
                            value: prevState.progress.value,
                            infoText: prevState.progress.infoText
                        },
                        buttonState:{
                            ums: prevState.buttonState.ums,
                            img: prevState.buttonState.img,
                            flash: prevState.buttonState.flash
                        },
                        isIPCserverOn: true,
                        window: prevState.window
                    }
                });
                
                const child = fork('./lib/elevate.js', [],{
                    silent: true, // in order for the stdin, stdout and stderr to get piped back to the parent process
                    env: window.process.env
                });
                child.stdout.on('data', (data)=>{
                    console.log(`${data}`);
                });

                child.stderr.on('data', (data)=>{
                    console.log(`${data}`);
                    child.kill();
                    reject();
                });

                child.on('close', (code) => {
                    console.log(`child process exited with code ${code}`);
                });

                ipc.server.on('script', function(data, socket){
                    resolve(socket);
                });
            });

            ipc.server.start();
        });
        
        IPCserverStarted.then((socket)=>{
            ipc.server.emit(
                socket,
                'script',
                {
                    id: ipc.config.id,
                    script: 'usbMassStorage',
                    device: '',
                    size: '',
                    img: ''
                }
            );
        });
    }

    selectImage(){
        dialog.showOpenDialog({title: 'Select OS image for Flashing' , filters:[{name: 'OS Images', extensions: ['img', 'xz']}]},(filePath) => {
            if(filePath === undefined){
                this.setState((prevState)=>{
                    return {
                        progress: {
                            value: 0,
                            infoText: 'No Image file is selected'
                        },
                        buttonState:{
                            ums: false,
                            img: true,
                            flash: false
                        },
                        isIPCserverOn: prevState.isIPCserverOn,
                        window: prevState.window
                    }
                });
                return;
            }
            else{
                imagePath = filePath[0];
                this.setState((prevState)=>{
                    return {
                        progress: {
                            value: 0,
                            infoText: 'Selected Image: ' + path.basename(imagePath)
                        },
                        buttonState:{
                            ums: false,
                            img: true,
                            flash: true
                        },
                        isIPCserverOn: prevState.isIPCserverOn,
                        window: prevState.window
                    }
                });
            }
        });
    }

    writeImage(){
        drivelist.list((error, drives)=>{
            drives.forEach((drive)=>{
                if(drive.description === 'UMS disk 0'){

                    IPCserverStarted.then((socket)=>{
                        ipc.server.emit(
                            socket,
                            'script',
                            {
                                id: ipc.config.id,
                                script: 'imageWrite',
                                device: drive.device,
                                size: drive.size,
                                img: imagePath
                            }
                        );
                    });
                }
            });
        });
        
    }



    render(){

        let WindowComponent = null;

        switch(this.state.window){
            case 'main': WindowComponent = <MainPage progressValue={this.state.progress.value}
                                                    infoText={this.state.progress.infoText}
                                                    umsState={this.state.buttonState.ums}
                                                    imgState={this.state.buttonState.img}
                                                    flashState={this.state.buttonState.flash}
                                                    umsHandle={this.umsClick}
                                                    imgHandle={this.selectImage}
                                                    flashHandle={this.writeImage}/>;
            break;

            case 'settings': WindowComponent = <Settings handleClick={this.mainClick}/>;
            break;

            case 'about': WindowComponent = <About handleClick={this.mainClick}/>;
            break;
        }

        return(
            <div className='wrapper'>
                <div className='pane'>
                    <nav className='navbar' id='mainNav'>
                        <ul>
                            <li id='brand'><h1 className='Text'>BeagleBoot</h1></li>
                            <li id='brand-text'><h5 className='Text'>Flash BeagleBone board quickly!</h5></li>
                            <li id='button'><Block task='' imgURL='./assets/settings.png' handleClick={this.settingsClick}/></li>
                            <li id='button'><Block task='' imgURL='./assets/info.png' handleClick={this.aboutClick}/></li>
                        </ul>
                    </nav>
                </div>
                <div id='mainBody'>
                    {WindowComponent}
                </div>
                <div id='footer'>
                    
                </div>
            </div>
        );
    }
}

export default App;