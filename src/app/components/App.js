var React = require('react');
require('../../css/main.css');
require('../../css/nav.css');
import Block from './Block';
import MainPage from './mainPage';
import Settings from './settings';

// Main App
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {window: 'main'};
        this.settingsClick = this.settingsClick.bind(this);
        this.mainClick = this.mainClick.bind(this);
        this.aboutClick = this.aboutClick.bind(this);
    }

    settingsClick(){
        this.setState(()=>({window: 'settings'}));
    }

    mainClick(){
        this.setState(()=>({window: 'main'}));
    }

    aboutClick(){
        this.setState(()=>({window: 'about'}));
    }

    render(){

        let WindowComponent = null;

        switch(this.state.window){
            case 'main': WindowComponent = <MainPage/>;
            break;

            case 'settings': WindowComponent = <Settings handleClick={this.mainClick}/>;
            break;

            case 'about': WindowComponent = <About/>;
            break;
        }

        return(
            <div className='wrapper'>
                <div className='pane'>
                    <nav className='navbar'>
                        <ul>
                            <li id='brand'><h1 className='Text'>BeagleBoot</h1></li>
                            <li id='brand-text'><h5 className='Text'>Flash BeagleBone board quickly!</h5></li>
                            <li id='button'><Block task='' imgURL='./images/settings.png' handleClick={this.settingsClick}/></li>
                            <li id='button'><Block task='' imgURL='./images/info.png'/></li>
                        </ul>
                    </nav>
                </div>
                <div id='mainBody'>
                    {WindowComponent}
                </div>
                <div id='footer'>
                    Footer Content here
                </div>
            </div>
        );
    }
}

export default App;