const React = require('react');

// React Components
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
                        <Block disabled={!this.props.umsState} task='USB Mass Storage' imgURL='./assets/usb-memory.png' handleClick={this.props.umsHandle}/>
                        <Block disabled={!this.props.imgState} task='Select Image' imgURL='./assets/image.png' handleClick={this.props.imgHandle}/>
                        <Block disabled={!this.props.flashState} task='Flash' imgURL='./assets/flash.png' handleClick={this.props.flashHandle}/>
                    </section>
                </div>
                <div id='prog'>
                    <Progress value={this.props.progressValue}/>
                </div>
                <div id='info'>
                    <Info value={this.props.infoText}/>
                </div>
            </div>
        );
    }
}

export default MainPage;