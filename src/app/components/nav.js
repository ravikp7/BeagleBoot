var React = require('react');
import Block from './Block';
require('../../css/nav.css');

function Navbar(props){
    return(
        <div id='navContain'>
            <nav>
                <ul>
                    <li id='button'><Block task='' imgURL='./images/back.png'/></li>
                    <li id='headerText'>{this.props.header}</li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;