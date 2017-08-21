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
                <p className='Text' id='block-text'>{this.props.task}</p>
            </button>
        );
    }
}

export default Block;