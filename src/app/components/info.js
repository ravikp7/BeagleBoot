var React = require('react');

class Info extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id='infoContainer'>
                <h5>{this.props.value}</h5>
            </div>
        );
    }
}

export default Info;