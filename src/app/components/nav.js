var React = require('react');
import Block from './Block';
require('../../css/nav.css');

function Navbar(props){
    return(
        <div className='pane'>
            <nav className='navbar'>
                <ul>
                    <li id='button'><Block handleClick={props.handleClick} task='' imgURL='./images/back.png'/></li>
                    <li id='headerText'><h3 className='Text'>{props.header}</h3></li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;