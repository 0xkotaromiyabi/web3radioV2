
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Radio, Newspaper, Calendar, Music, ShoppingBag } from 'lucide-react';

const NavBar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Radio', icon: Radio },
    { path: '/news', label: 'News', icon: Newspaper },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/stations', label: 'Stations', icon: Music },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/web3radio-logo.png" 
              alt="Web3 Radio" 
              className="w-8 h-8 rounded-full"
            />
            <span className="text-xl font-bold text-green-400">Web3 Radio</span>
          </Link>
          
          <div className="flex space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? 'text-green-400 bg-gray-800'
                    : 'text-gray-300 hover:text-green-400 hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
