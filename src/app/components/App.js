var React = require('react');
require('../../css/main.css');
require('../../css/nav.css');
import Block from './Block';

// Main App
class App extends React.Component{
    render(){
        return(
            <div className='wrapper'>
                <div id='pane'>
                    <nav>
                        <ul>
                            <li><a href='#'>Settings</a></li>
                            <li><a href='#'>About</a></li>
                        </ul>
                    </nav>
                    <section id='blocks'>
                        <Block task='USB Mass Storage' imgURL='./images/usb-memory.png'/>
                        <Block task='Select Image' imgURL='./images/image.png'/>
                        <Block task='Flash' imgURL='./images/flash.png'/>
                    </section>
                </div>
            </div>
        );
    }
}

export default App;