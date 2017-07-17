var React = require('react');

class Info extends React.Component{
    constructor(props){
        super(props);
        this.state = {text: this.props.value};
    }

    render(){
        return(
            <div id='infoContainer'>
                <h5>{this.state.text}</h5>
            </div>
        );
    }
}

export default Info;