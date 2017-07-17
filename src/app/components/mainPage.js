var React = require('react');
import Block from './Block';
import Progress from './progress';
import Info from './info';

class MainPage extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <div id='bl'>    
                    <section id='blocks'>
                        <Block id='usb' task='USB Mass Storage' imgURL='./images/usb-memory.png'/>
                        <Block id='img' task='Select Image' imgURL='./images/image.png'/>
                        <Block id='flash' task='Flash' imgURL='./images/flash.png'/>
                    </section>
                </div>
                <div id='prog'>
                    <Progress value='30'/>
                </div>
                <div id='info'>
                    <Info value="Info here!"/>
                </div>
            </div>
        );
    }
}

export default MainPage;