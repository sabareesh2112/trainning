import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { Sun, Moon } from 'lucide-react';
import './ThemeToggle.css';

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <label
      className={`cosmic-toggle-switch ${isDark ? 'is-dark' : 'is-light'} ${className}`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label={`Toggle theme: currently ${theme} mode`}
    >
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
      />
      <span className="cosmic-toggle-slider">
        {/* Star Sparkle Particles (Dark/Night mode) */}
        <span className="cosmic-toggle-sparkles">
          <span className="cosmic-toggle-star s1" />
          <span className="cosmic-toggle-star s2" />
          <span className="cosmic-toggle-star s3" />
          <span className="cosmic-toggle-star s4" />
        </span>

        {/* Soft Solar Cloud Puffs (Light/Day mode) */}
        <span className="cosmic-toggle-clouds">
          <span className="cosmic-toggle-cloud c1" />
          <span className="cosmic-toggle-cloud c2" />
        </span>

        {/* Sliding Circular Knob with Rotating Icon */}
        <span className="cosmic-toggle-knob">
          {isDark ? (
            <Moon className="cosmic-toggle-icon moon" />
          ) : (
            <Sun className="cosmic-toggle-icon sun" />
          )}
        </span>
      </span>
    </label>
  );
};

export default ThemeToggle;
