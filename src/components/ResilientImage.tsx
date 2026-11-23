import { useState } from 'react';
import { MonitorCog } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle: string;
  priority?: boolean;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  priority = false,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-sky-950 text-slate-200 p-6 text-center ${className}`}
      >
        <MonitorCog className="w-9 h-9 text-sky-400 mb-2.5" strokeWidth={1.5} />
        <p className="text-xs sm:text-sm font-medium text-slate-300">{fallbackTitle}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
