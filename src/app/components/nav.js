var React = require('react');
import Block from './Block';
require('../../css/nav.css');

function Navbar(props){

    return(
        <div className='pane'>
            <nav className='navbar' id='navbarPage'>
                <ul>
                    <li id='button'><Block handleClick={props.handleClick} task='' imgURL='./assets/back.png'/></li>
                    <li id='headerText'><div><h3 className='Text'>{props.header}</h3></div></li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;