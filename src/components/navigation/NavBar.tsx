
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Newspaper, Calendar, Radio, Mic, Menu, X } from 'lucide-react';
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#444] bg-gray-900/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/web3radio-logo.png" 
              alt="Web3Radio" 
              className="h-8 w-8" 
            />
            <span className="hidden font-bold text-white sm:inline-block">Web3Radio</span>
          </Link>
          
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "group flex gap-1")}>
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/news">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "group flex gap-1")}>
                    <Newspaper className="h-4 w-4" />
                    <span>News</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/events">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "group flex gap-1")}>
                    <Calendar className="h-4 w-4" />
                    <span>Events</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/stations">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "group flex gap-1")}>
                    <Radio className="h-4 w-4" />
                    <span>Radio Stations</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Broadcaster Button - Desktop */}
        <Button 
          variant="outline" 
          className="hidden md:flex gap-1 bg-gradient-to-r from-purple-600 to-blue-500 border-none text-white hover:from-purple-700 hover:to-blue-600"
        >
          <Mic className="h-4 w-4" />
          <span>Become a Broadcaster</span>
        </Button>

        {/* Mobile Menu Toggle */}
        <button
          className="flex md:hidden items-center justify-center rounded-md p-2 text-white"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-3 pt-2 bg-gray-900 border-b border-[#444]">
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/news" 
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Newspaper className="h-4 w-4" />
              <span>News</span>
            </Link>
            <Link 
              to="/events" 
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Calendar className="h-4 w-4" />
              <span>Events</span>
            </Link>
            <Link 
              to="/stations" 
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Radio className="h-4 w-4" />
              <span>Radio Stations</span>
            </Link>
            <div className="pt-2 border-t border-gray-800">
              <Button 
                variant="outline" 
                className="w-full flex gap-1 justify-center bg-gradient-to-r from-purple-600 to-blue-500 border-none text-white hover:from-purple-700 hover:to-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Mic className="h-4 w-4" />
                <span>Become a Broadcaster</span>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
