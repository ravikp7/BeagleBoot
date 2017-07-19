var React = require('react');
require('../../css/progress.css');

class Progress extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        
        const divStyle = {
            width: 3.5*this.props.value
        };

        return(
            <div id='progressContainer'>
                <div style={divStyle} id='progressBar'></div>
            </div>
        );
    }
}

export default Progress;