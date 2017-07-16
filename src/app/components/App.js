var React = require('react');
require('../../css/main.css');
require('../../css/nav.css');

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
                </div>
            </div>
        );
    }
}

export default App;