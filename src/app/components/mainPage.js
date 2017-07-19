var React = require('react');
import Block from './Block';
import Progress from './progress';
import Info from './info';
var BB = window.require('beagle-boot');

class MainPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {progressValue: 0, infoText: 'Go ahead! click USB Mass Storage button to begin'};
        this.umsClick = this.umsClick.bind(this);
    }

    umsClick(){
        var ums = BB.usbMassStorage();
        ums.on('progress', function(status){
            console.log(status);
            this.setState(()=>({progressValue: status.complete, infoText: status.description}));
        }.bind(this));

        ums.on('done', ()=>{
            console.log('Select Image');
            this.setState(()=>({progressValue: 0, infoText: 'Select image for flashing'}));
        });

        ums.on('error', function(error){
            console.log('Error: '+error);
            this.setState(()=>({progressValue: 0, infoText: 'Please disconnect usb cable, connect and try again'}));
        });
    }

    render(){
        return(
            <div>
                <div id='bl'>    
                    <section id='blocks'>
                        <Block id='usb' task='USB Mass Storage' imgURL='./assets/usb-memory.png' handleClick={this.umsClick}/>
                        <Block id='img' task='Select Image' imgURL='./assets/image.png'/>
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