import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useDisconnect } from 'wagmi';
import { Home, Newspaper, Calendar, Radio, Menu, X, Users, Gift, Smartphone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from '@/assets/web3radio-logo.png';

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLUListElement>(null);
  const animRef = useRef<number | null>(null);
  const [currentActiveItem, setCurrentActiveItem] = useState<HTMLAnchorElement | null>(null);

  // Unified AppKit State
  const { open: openAppKit } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();
  const { disconnect } = useDisconnect();
  const networkName = caipNetwork?.name || 'Unknown';

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/news', label: 'News', icon: Newspaper },
    { to: '/events', label: 'Events', icon: Calendar },
    { to: '/rental', label: 'Rental', icon: Smartphone },
    { to: '/ply', label: 'PLY', icon: Gift },
    { to: '/dao', label: 'DAO', icon: Users },
  ];

  const animate = useCallback((from: number, to: number) => {
    if (animRef.current) clearInterval(animRef.current);
    if (!navRef.current) return;

    const start = Date.now();
    const nav = navRef.current;

    animRef.current = window.setInterval(() => {
      const p = Math.min((Date.now() - start) / 500, 1);
      const e = 1 - Math.pow(1 - p, 3); // easeOutCubic

      const x = from + (to - from) * e;
      const y = -40 * (4 * e * (1 - e));
      const r = 200 * Math.sin(p * Math.PI);

      nav.style.setProperty('--translate-x', `${x}px`);
      nav.style.setProperty('--translate-y', `${y}px`);
      nav.style.setProperty('--rotate-x', `${r}deg`);

      if (p >= 1) {
        if (animRef.current) clearInterval(animRef.current);
        animRef.current = null;
        nav.style.setProperty('--translate-y', '0px');
        nav.style.setProperty('--rotate-x', '0deg');
      }
    }, 16);
  }, []);

  const getCurrentPosition = () => parseFloat(navRef.current?.style.getPropertyValue('--translate-x') || '0') || 0;

  const getItemCenter = (item: HTMLElement) => {
    if (!navRef.current) return 0;
    const navRect = navRef.current.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    return itemRect.left + itemRect.width / 2 - navRect.left - 6; // -6 for half of dot width (12px)
  };

  const moveToItem = (item: HTMLElement) => {
    const current = getCurrentPosition();
    const center = getItemCenter(item);
    animate(current, center);
    navRef.current?.classList.add('show-indicator');
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    moveToItem(e.currentTarget);
  };

  const handleMouseLeaveNav = () => {
    if (currentActiveItem) {
      moveToItem(currentActiveItem);
    } else {
      navRef.current?.classList.remove('show-indicator');
      if (animRef.current) {
        clearInterval(animRef.current);
        animRef.current = null;
      }
    }
  };

  // Sync animation with router location
  useEffect(() => {
    const links = navRef.current?.querySelectorAll('a');
    if (links) {
      let found = false;
      links.forEach(link => {
        const to = link.getAttribute('href');
        if (to === location.pathname) {
          setCurrentActiveItem(link as HTMLAnchorElement);
          moveToItem(link as HTMLAnchorElement);
          found = true;
        }
      });
      if (!found) {
        navRef.current?.classList.remove('show-indicator');
      }
    }
  }, [location.pathname]);

  return (
    <header className="fixed top-0 w-full z-[100] px-4">
      {/* CSS Styles */}
      <style>{`
        .nav-container {
          position: fixed;
          width: fit-content;
          inset-inline: 0px;
          margin: auto;
          margin-top: 25px;
          padding: 0 10px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.5);
          overflow: visible;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          gap: 5px;
          transition: all 0.3s ease;
          isolation: isolate;
        }

        .nav-container:before {
          content: '';
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          backdrop-filter: url(#wave-distort);
          z-index: -2;
          border-radius: 20px;
        }

        .nav-list {
          position: relative;
          list-style: none;
          display: flex;
          justify-content: center;
          height: 52px;
          isolation: isolate;
          padding: 0 10px;
        }

        .nav-list::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 6px;
          width: 10px;
          height: 10px;
          background: #515044;
          border-radius: 50%;
          transform: translateX(var(--translate-x, 0)) translateY(var(--translate-y, 0)) rotate(var(--rotate-x, 0deg));
          transition: none;
          opacity: 0;
          z-index: -1;
          box-shadow: 0 2px 8px rgba(81, 80, 68, 0.4);
          border: 1.5px solid rgba(255, 255, 255, 0.8);
        }

        .nav-list.show-indicator::after {
          opacity: 1;
        }

        .nav-link {
          position: relative;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #515044;
          text-decoration: none;
          font-weight: 800;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding-inline: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          opacity: 0.7;
        }

        .nav-link:hover, .nav-link.active {
          opacity: 1;
          color: #000;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
           .nav-container {
             width: 95vw;
             padding: 0 5px;
             margin-top: 15px;
           }
           .nav-link {
             padding-inline: 8px;
             font-size: 0.6rem;
             letter-spacing: 0.05em;
           }
           .nav-desktop-only {
             display: none;
           }
        }
      `}</style>

      <nav className="nav-container">
        {/* Logo */}
        <Link to="/" className="flex items-center ml-3 nav-desktop-only hover:scale-105 transition-transform">
          <img src={logo} alt="Web3Radio" className="w-8 h-8 rounded-lg" />
        </Link>

        {/* Links */}
        <ul ref={navRef} className="nav-list" onMouseLeave={handleMouseLeaveNav}>
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={cn("nav-link", location.pathname === link.to && "active")}
                onMouseEnter={handleMouseEnter}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Wallet Connection */}
        <div className="mr-2 nav-desktop-only">
          {!isConnected ? (
            <button
              onClick={() => openAppKit()}
              className="px-4 py-2 bg-[#515044] text-white rounded-xl font-bold text-[9px] uppercase tracking-wider shadow-sm hover:bg-black transition-all flex items-center gap-2"
            >
              <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              Connect
            </button>
          ) : (
            <button
              onClick={() => openAppKit({ view: 'Account' })}
              className="px-3 py-2 bg-white/50 border border-[#515044]/10 text-[#515044] rounded-xl font-mono text-[9px] shadow-sm hover:bg-white/80 transition-all flex items-center gap-1.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {address?.slice(0, 4)}...{address?.slice(-4)}
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* SVG Filter */}
      <svg className="hidden">
        <defs>
          <filter id="wave-distort" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.0038 0.0038" numOctaves="1" seed="2" result="roughNoise" />
            <feGaussianBlur in="roughNoise" stdDeviation="8.5" result="softNoise" />
            <feComposite operator="arithmetic" k1="0" k2="1" k3="2" k4="0" in="softNoise" result="mergedMap" />
            <feDisplacementMap in="SourceGraphic" in2="mergedMap" scale="-42" xChannelSelector="G" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* UI for Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-16 mx-auto w-[92vw] glass border border-white/30 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-5 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all",
                  location.pathname === link.to ? "bg-[#515044] text-white shadow-lg" : "text-[#515044] hover:bg-[#515044]/5"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon size={20} />
                <span className="uppercase tracking-widest text-[11px]">{link.label}</span>
              </Link>
            ))}
            <div className="h-px bg-[#515044]/10 my-1" />
            {!isConnected ? (
              <button
                onClick={() => openAppKit()}
                className="w-full py-4 bg-[#515044] text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-sm"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { openAppKit({ view: 'Account' }); setMobileMenuOpen(false); }}
                  className="w-full px-5 py-4 bg-white border border-[#515044]/10 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/40">{networkName}</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold">{address?.slice(0, 8)}...{address?.slice(-4)}</span>
                </button>
                <button
                  onClick={() => { disconnect(); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-[10px] font-bold text-red-500/60 uppercase tracking-widest"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
