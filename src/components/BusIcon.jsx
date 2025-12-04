import React from 'react';

const BusIcon = ({ className = "w-6 h-6" }) => {
  return (
    <svg 
      className={className} 
      fill="currentColor" 
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9v6l-2 2v2h2l2-2h10l2 2h2v-2l-2-2V9c0-3.87-3.13-7-7-7zM7 10.5A1.5 1.5 0 017 13a1.5 1.5 0 01-1.5-1.5A1.5 1.5 0 017 10.5zm10 0a1.5 1.5 0 011.5 1.5A1.5 1.5 0 0117 13a1.5 1.5 0 01-1.5-1.5A1.5 1.5 0 0117 10.5zM8 16h8v1H8v-1z"/>
    </svg>
  );
};

export default BusIcon;