var React = require('react');
import Navbar from './nav';

class Settings extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <Navbar header='Settings' handleClick={this.props.handleClick}/>
            </div>
        );
    }
}

export default Settings;