import React from 'react';
import Header from './common/header.js';
import Menu from './common/menu.js';
import { Outlet } from 'react-router-dom';

const Main = ({handleSearchChange, handleKeyDown, handleMenu, handleLogout}) => {
  return (
    <div className="fake-stack-overflow">
      <Header handleChange={handleSearchChange} handleKeyDown={handleKeyDown} handleLogout={handleLogout}/>
      <div id="main">
        <Menu handleMenu={handleMenu} />
        <main id="page">
          <Outlet />  
        </main>
      </div>
    </div>
  );
};

export default Main;