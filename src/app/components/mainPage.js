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
import Progress from './progress';
import Info from './info';

var IPCserverStarted;   // Promise, returns socket on resolution
var imagePath;


class MainPage extends React.Component{
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
            }
        };
        this.umsClick = this.umsClick.bind(this);
        this.selectImage = this.selectImage.bind(this);
        this.writeImage = this.writeImage.bind(this);

        // IPC Server
        window.process.env.IPC_SERVER_ID = `BB-server-${window.process.pid}`;
        window.process.env.IPC_CLIENT_ID = `BB-client-${window.process.pid}`;

        ipc.config.id = window.process.env.IPC_SERVER_ID;
        ipc.config.silent = true;
        ipc.serve();

        ipc.server.on('message', function(data){
            console.log(data);
            try{
                var status = JSON.parse(data);
            }
            catch(e){ }
            if(status && status.description) this.setState((prevState)=>{
                return {
                    progress: {
                        value: status.complete,
                        infoText: status.description
                    },
                    buttonState:{
                        ums: prevState.buttonState.ums,
                        img: prevState.buttonState.img,
                        flash: prevState.buttonState.flash
                    }
                }
            });

            if(status && status.done) this.setState((prevState)=>{
                return {
                    progress: {
                        value: 0,
                        infoText: 'Select Image for flashing'
                    },
                    buttonState:{
                        ums: false,
                        img: true,
                        flash: false
                    }
                }
            });

            if(status && status.type)this.setState((prevState)=>{
                return {
                    progress: {
                        value: status.percentage,
                        infoText: 'Writing Image => Percentage: '+status.percentage.toFixed(2)+'%  ---- Speed: '+(status.speed/(1024*1024)).toFixed(2)+'MB/s ---- ETA: '+Math.floor(status.eta/60)+' min.'
                    },
                    buttonState:{
                        ums: false,
                        img: false,
                        flash: false
                    }
                }
            });
        }.bind(this));
    }

        

    umsClick(){
        // Promise, starts IPC server and returns socket for client on resolution
        IPCserverStarted = new Promise((resolve, reject)=>{

            ipc.server.on('start', () => {
                
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
                        }
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
                        }
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
        return(
            <div>
                <div id='bl'>    
                    <section id='blocks'>
                        <Block disabled={!this.state.buttonState.ums} task='USB Mass Storage' imgURL='./assets/usb-memory.png' handleClick={this.umsClick}/>
                        <Block disabled={!this.state.buttonState.img} task='Select Image' imgURL='./assets/image.png' handleClick={this.selectImage}/>
                        <Block disabled={!this.state.buttonState.flash} task='Flash' imgURL='./assets/flash.png' handleClick={this.writeImage}/>
                    </section>
                </div>
                <div id='prog'>
                    <Progress value={this.state.progress.value}/>
                </div>
                <div id='info'>
                    <Info value={this.state.progress.infoText}/>
                </div>
            </div>
        );
    }
}

export default MainPage;