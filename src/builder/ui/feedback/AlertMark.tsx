import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface AlertMarkProps {
  className?: string;
  id?: string;
}

export function AlertMark({ 
  className = 'w-3.5 h-3.5 text-amber-400 animate-pulse',
  id = 'readiness-mark-alert'
}: AlertMarkProps) {
  return (
    <AlertTriangle 
      className={className} 
      id={id} 
    />
  );
}
