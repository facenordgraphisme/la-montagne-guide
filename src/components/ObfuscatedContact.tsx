'use client'

import React, { useState, useEffect } from 'react'

interface ObfuscatedContactProps {
  type: 'email' | 'phone'
  value: string
  className?: string
}

export default function ObfuscatedContact({ type, value, className = '' }: ObfuscatedContactProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render placeholder on server to block bots parsing raw HTML
    return (
      <span className={`${className} opacity-50`}>
        {type === 'email' ? 'draperinicolas [at] hotmail.com' : '+33 (0)6 ** ** **'}
      </span>
    )
  }

  // Render clickable link on client after mount
  const cleanedValue = value.trim()
  const href = type === 'email' 
    ? `mailto:${cleanedValue}` 
    : `tel:${cleanedValue.replace(/[\s()]/g, '')}`

  return (
    <a href={href} className={`hover:text-accent transition-colors duration-300 ${className}`}>
      {cleanedValue}
    </a>
  )
}
