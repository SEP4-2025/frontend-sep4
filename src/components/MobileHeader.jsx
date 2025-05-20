import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';

function MobileHeader({ toggleMobileNav, title }) {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`lg:hidden p-4 text-white flex items-center justify-between shadow-md sticky top-0 z-20 ${
        darkMode ? 'bg-slate-800' : 'bg-[#28463a]'
      }`}
    >
      <button
        onClick={toggleMobileNav}
        className="text-2xl p-1"
        aria-label="Open navigation menu"
      >
        &#9776; {/* Hamburger icon */}
      </button>
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="w-8"></div> {/* Spacer to balance the hamburger icon */}
    </div>
  );
}

export default MobileHeader;