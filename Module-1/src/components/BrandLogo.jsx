import React from 'react';
import logoImg from '../assets/Indegene_Logo_png.png';

const BrandLogo = ({ size = 'medium', className = '' }) => {
  // Map dimensions based on size prop to fit headers, login page, and sidebars
  const height = size === 'small' ? '28px' : size === 'large' ? '56px' : '40px';

  return (
    <div 
      className={`brand-logo-wrapper ${className}`} 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        userSelect: 'none'
      }}
    >
      <img 
        src={logoImg} 
        alt="Indegene Logo" 
        style={{ 
          height: height, 
          width: 'auto',
          display: 'block',
          objectFit: 'contain'
        }} 
      />
    </div>
  );
};

export default BrandLogo;
