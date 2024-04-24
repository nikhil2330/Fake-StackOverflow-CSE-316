import React from 'react';


function Menu({ active, handleMenu }) {
    return (
    <div id="menu" className="menu">
      <ul>
        <li><div id = "firstpage"  className = {(active === 'firstpage' || active === 'searchresults' || active === 'tagquestions') ? 'active' : ''} onClick = {handleMenu}>Questions</div></li>
        <li><div id = "tags" className = {active === 'tags' ? 'active' : ''} onClick = {handleMenu}>Tags</div></li>
      </ul>
    </div>
  );
}

export default Menu;