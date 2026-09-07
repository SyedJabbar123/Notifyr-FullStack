import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // 1. Handle the navbar background blur
      setIsScrolled(window.scrollY > 10);

      // 2. Only track sections if we are on the main landing page
      if (location.pathname !== '/') {
        setActiveSection('');
        return;
      }

      // Track which section is in view
      // We check in reverse order (bottom to top) to find the first one we've scrolled past
      const sections = ['support', 'pricing', 'how-it-works'];
      // Add a 150px offset to account for the sticky navbar height
      const scrollPosition = window.scrollY + 150; 

      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition) {
          current = section;
          break; // Stop checking once we find the highest matching section
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    // Run it once on mount to set the initial state
    handleScroll(); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper function to render Nav Links with active styling
  const NavLink = ({ id, label }) => {
    const isActive = activeSection === id;
    
    return (
      <button 
        onClick={() => scrollToSection(id)} 
        className={`relative transition-colors duration-200 ${
          isActive ? 'text-[#0A1931] font-bold' : 'hover:text-[#0A1931]'
        }`}
      >
        {label}
        {/* The active yellow dot indicator */}
        {isActive && (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FFB800] rounded-full" />
        )}
      </button>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/40 backdrop-blur-md border-b border-white/20 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        
        {/* Logo / Home Button */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => {
            if (location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              navigate('/');
            }
          }}
        >
          <span className="text-xl font-black tracking-tight text-[#0A1931]">Notifyr</span>
          <span className="w-2 h-2 rounded-full bg-[#FFB800]" />
        </div>

        {/* Navigation Links with Active Highlighting */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#64748B]">
          <NavLink id="how-it-works" label="How it Works" />
          <NavLink id="pricing" label="Get Tags" />
          <NavLink id="support" label="Support" />
        </nav>

        {/* Login Button */}
        <button
          onClick={() => navigate('/admin/login')}
          className="bg-[#0A1931] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-[#132647] transition-all"
        >
          Dashboard Login
        </button>
      </div>
    </header>
  );
}