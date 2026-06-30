import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ReadyMarkProps {
  className?: string;
  id?: string;
}

export function ReadyMark({ 
  className = 'w-3.5 h-3.5 text-emerald-400',
  id = 'readiness-mark-ready'
}: ReadyMarkProps) {
  return (
    <CheckCircle2 
      className={className} 
      id={id} 
    />
  );
}
