import React from 'react'

export function StudioLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img
        src="/icon.png"
        alt="La Montagne Guide Logo"
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          objectFit: 'cover',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      />
      <span style={{ 
        fontWeight: 800, 
        fontSize: '14px', 
        letterSpacing: '1px',
        color: '#f1f5f9',
        fontFamily: "'Outfit', 'Inter', sans-serif",
        textTransform: 'uppercase'
      }}>
        La Montagne
      </span>
    </div>
  )
}
