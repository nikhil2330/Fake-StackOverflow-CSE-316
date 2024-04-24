import React from 'react';

function Header({handleChange, handleKeyDown}) {
  return (
    <header id="header">
      <h1 id = "main_title">Fake Stack Overflow</h1>
      <div id="search">
        <input type="text" id="input" placeholder="Search . . ." onChange = {handleChange}
         onKeyDown={handleKeyDown}/>
      </div>
    </header>
  );
}

export default Header;