var React = require('react');
require('../../css/block.css');

class Block extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        console.log('clicked');
    }

    render(){

        return(
            <button className='block' onClick={this.handleClick}>
                <img src={this.props.imgURL}/>
                <h4 id='task'>{this.props.task}</h4>
            </button>
        );
    }
}

export default Block;