import React from 'react';

function Header({handleChange, handleKeyDown, handleLogout}) {
  return (
    <header id="header">
      <h1 id = "main_title">Fake Stack Overflow</h1>
      <div id="search">
        <input type="text" id="input" placeholder="Search . . ." onChange = {handleChange}
         onKeyDown={handleKeyDown}/>
      </div>
      <button onClick={handleLogout}>logout</button>
    </header>
  );
}

export default Header;