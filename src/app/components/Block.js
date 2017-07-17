var React = require('react');
require('../../css/block.css');

class Block extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {ButtonState: {usb: false, img: true, flash: true}};
    }

    handleClick(){
        console.log('clicked');
    }

    render(){

        return(
            <button className='block' onClick={this.handleClick} disabled={this.state.ButtonState[this.props.id]}>
                <img src={this.props.imgURL}/>
                <h4 className='Text'>{this.props.task}</h4>
            </button>
        );
    }
}

export default Block;