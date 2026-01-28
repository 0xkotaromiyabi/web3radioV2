
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Newspaper, Calendar, Radio, Menu, X, Users, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from '@/assets/web3radio-logo.png';

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/news', label: 'News', icon: Newspaper },
    { to: '/events', label: 'Events', icon: Calendar },
    { to: '/stations', label: 'Radio Stations', icon: Radio },
    { to: '/dao', label: 'Web3Radio DAO', icon: Users }, // Updated from 17an Onchain
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={cn(
        "w-full border-b border-border/50 transition-all duration-300",
        scrolled
          ? "glass shadow-apple py-2"
          : "bg-background py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Web3Radio"
            className="w-10 h-10 rounded-xl shadow-apple transition-all duration-300 group-hover:scale-105 group-hover:shadow-apple-md"
          />
          <span className="font-semibold text-lg text-foreground hidden sm:block">
            Web3Radio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <button
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive(link.to)
                    ? "bg-black/5 dark:bg-white/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </button>
            </Link>
          ))}
        </nav>

        {/* Login Button - Desktop */}
        <Link to="/dashboard" className="hidden md:block">
          <Button
            className="btn-apple-primary flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Button>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="flex md:hidden items-center justify-center w-10 h-10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 text-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 top-[57px] z-50 transform transition-all duration-300 ease-in-out",
          mobileMenuOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-4 opacity-0 pointer-events-none"
        )}
      >
        <nav className="mx-4 mt-2 rounded-2xl glass border border-border/50 shadow-apple-md overflow-hidden">
          <div className="py-3 px-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive(link.to)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="h-px bg-border/50 my-2" />
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full btn-apple-primary justify-center">
                <LogIn className="h-4 w-4 mr-2" />
                <span>Login</span>
              </Button>
            </Link>
          </div>
        </nav>
        {/* Backdrop */}
        <div
          className="fixed inset-0 -z-10 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      </div>
    </header>
  );
};

export default NavBar;
