const React = require('react');
const BB = window.require('beagle-boot');
const app = window.require('electron').remote; 
const dialog = app.dialog;
const fork = window.require('child_process').fork;
const sudo = window.require('sudo-prompt');
const ipc = window.require('node-ipc');
const fs = window.require('fs');

// React Components
import Block from './Block';
import Progress from './progress';
import Info from './info';

class MainPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {progressValue: 0, infoText: 'Go ahead! click USB Mass Storage button to begin'};
        this.umsClick = this.umsClick.bind(this);
        this.selectImage = this.selectImage.bind(this);
    }

    umsClick(){
       
        // IPC
        window.process.env.IPC_SERVER_ID = `BB-server-${window.process.pid}`;
        window.process.env.IPC_CLIENT_ID = `BB-client-${window.process.pid}`;

        ipc.config.id = window.process.env.IPC_SERVER_ID;
        ipc.config.silent = true;
        ipc.serve();
        ipc.server.on('start', () => {
            var child = fork('./lib/elevate.js', [],{
                silent: true, // in order for the stdin, stdout and stderr to get piped back to the parent process
                env: window.process.env
            });
            child.stdout.on('data', (data)=>{
                console.log(`${data}`);
            });

            child.stderr.on('data', (data)=>{
                console.log(`${data}`);
                child.kill();
            });

            child.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
            });
        });
        ipc.server.start();

        ipc.server.on('message', function(data){
            console.log(data);
            try{
                var status = JSON.parse(data);
            }
            catch(e){ }
            if(status && status.description) this.setState(()=>({progressValue: status.complete, infoText: status.description}));
        }.bind(this));
    }

    selectImage(){
        dialog.showOpenDialog({title: 'Select OS image for Flashing' , filters:[{name: 'OS Images', extensions: ['img', 'xz']}]},(filePath) => {
            if(filePath === undefined){
                console.log("No file selected");
                return;
            }
            console.log(filePath);
        });
    }

    render(){
        return(
            <div>
                <div id='bl'>    
                    <section id='blocks'>
                        <Block id='usb' task='USB Mass Storage' imgURL='./assets/usb-memory.png' handleClick={this.umsClick}/>
                        <Block id='img' task='Select Image' imgURL='./assets/image.png' handleClick={this.selectImage}/>
                        <Block id='flash' task='Flash' imgURL='./assets/flash.png'/>
                    </section>
                </div>
                <div id='prog'>
                    <Progress value={this.state.progressValue}/>
                </div>
                <div id='info'>
                    <Info value={this.state.infoText}/>
                </div>
            </div>
        );
    }
}

export default MainPage;