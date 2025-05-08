import React, { createContext, useContext, useState, useEffect } from 'react';

const FONT_SIZES_CONFIG = {
  small: 'font-size-small', // Class for small font size
  medium: 'font-size-medium', // Class for medium font size
  large: 'font-size-large', // Class for large font size
};
const DEFAULT_FONT_SIZE_KEY = 'medium';
const LOCAL_STORAGE_KEY = 'font-size-preference';

const FontSizeContext = createContext();

export const FontSizeProvider = ({ children }) => {
  const [fontSizeKey, setFontSizeKey] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY) || DEFAULT_FONT_SIZE_KEY;
  });

  useEffect(() => {
    // Remove any existing font size classes
    Object.values(FONT_SIZES_CONFIG).forEach(className => {
      document.documentElement.classList.remove(className);
    });

    // Add the new font size class
    const newClass = FONT_SIZES_CONFIG[fontSizeKey];
    if (newClass) {
      document.documentElement.classList.add(newClass);
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, fontSizeKey);
  }, [fontSizeKey]);

  return (
    <FontSizeContext.Provider value={{ fontSizeKey, setFontSizeKey, FONT_SIZES_CONFIG }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => useContext(FontSizeContext);
