import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="glass p-6 border-red-500/50 bg-red-500/10">
      <div className="flex items-start gap-3">
        <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">Error</h3>
          <p className="text-red-200">{message}</p>
          {onRetry && (
            <button onClick={onRetry} className="btn-primary mt-4">
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}