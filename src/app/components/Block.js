var React = require('react');
require('../../css/block.css');

class Block extends React.Component{
    constructor(props){
        super(props);
    }

    render(){

        return(
            <button className='block' onClick={this.props.handleClick} disabled={this.props.disabled}>
                <img src={this.props.imgURL}/>
                <h4 className='Text'>{this.props.task}</h4>
            </button>
        );
    }
}

export default Block;