var React = require('react');
require('../../css/main.css');

class Info extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id='infoContainer'>
                <p id='info-text'>{this.props.value}</p>
            </div>
        );
    }
}

export default Info;