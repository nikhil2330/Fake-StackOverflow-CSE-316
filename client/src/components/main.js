import React from 'react';
import Header from './common/header.js';

import { Outlet } from 'react-router-dom';

const Main = ({handleSearchChange, handleKeyDown, handleMenu, handleLogout, handleProfile}) => {
  return (
    <div className="fake-stack-overflow">
      <Header handleChange={handleSearchChange} handleKeyDown={handleKeyDown} handleProfile={handleProfile} handleLogout={handleLogout} handleMenu={handleMenu}/>
      <div id="main">
        <main id="page">
          <Outlet />  
        </main>
      </div>
    </div>
  );
};

export default Main;