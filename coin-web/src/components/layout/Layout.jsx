import React from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar Desktop */}
      <Sidebar />
      
      {/* Conteúdo Principal */}
      <main className="flex-1 w-full md:pl-52 pb-20 md:pb-0">
        {children}
      </main>
      
      {/* Navegação Mobile */}
      <MobileNav />
    </div>
  );
};

export default Layout;
