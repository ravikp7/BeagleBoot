var React = require('react');
import Navbar from './nav';

class About extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <Navbar header='About' handleClick={this.props.handleClick}/>
            </div>
        );
    }
}

export default About;