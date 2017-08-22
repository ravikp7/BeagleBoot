const React = require('react');
const platform = window.require('os').platform();
const Window = window.require('electron').remote.getCurrentWindow();
import Block from './Block';
require('../../css/title.css');

class TitleBar extends React.Component{
    constructor(props){
        super(props);
        this.minimize = this.minimize.bind(this);
        this.close = this.close.bind(this);
    }

    minimize(){
        Window.minimize();
    }

    close(){
        Window.close();
    }

    render(){
    let Titlebar = null;

    if(platform != 'darwin') Titlebar = <div id='titleDiv'>
        <div id='minimize'>
            <Block task='' imgURL='./assets/minimize.png' handleClick={this.minimize}/>
        </div>
        <div id='close'>
            <Block task='' imgURL='./assets/close.png' handleClick={this.close}/>
        </div>
    </div> 

    return(
        <div className='titleBar'>
            {Titlebar}
        </div>
    );
    }
}

export default TitleBar;