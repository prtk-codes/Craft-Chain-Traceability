import { Loader2 } from 'lucide-react';

export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="animate-spin text-primary mb-4" size={48} />
      <p className="text-white/70 text-lg">{message}</p>
    </div>
  );
}