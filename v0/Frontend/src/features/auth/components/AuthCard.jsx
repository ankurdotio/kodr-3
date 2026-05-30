import React from 'react';

export default function AuthCard({ title, error, loading, onSubmit, submitText, footerLink, children }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 relative page-transition" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Centered Auth Card */}
      <div className="w-full max-w-[400px] p-8 rounded-[var(--radius)] border theme-transition" 
           style={{ 
             backgroundColor: 'var(--surface)', 
             borderColor: 'var(--border)'
           }}>
        
        {/* Logo and Wordmark */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg mb-2" 
               style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text)' }}>
            Forge
          </h1>
          <p className="text-xs uppercase tracking-widest font-mono" style={{ color: 'var(--muted)' }}>
            Sandbox Builder
          </p>
        </div>

        {/* Title */}
        <h2 className="text-lg font-medium mb-6 text-center" style={{ color: 'var(--text)' }}>
          {title}
        </h2>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {children}

          {/* Error Message */}
          {error && (
            <div className="text-xs font-mono p-3 rounded border text-red-500 bg-red-500/10 border-red-500/20">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-[var(--radius)] font-medium text-sm font-sans theme-transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#ffffff',
            }}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              submitText
            )}
          </button>
        </form>

        {/* Footer Toggle Link */}
        <div className="mt-6 text-center text-xs font-sans" style={{ color: 'var(--muted)' }}>
          {footerLink}
        </div>
      </div>
    </div>
  );
}
