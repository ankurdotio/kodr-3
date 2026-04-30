import React from 'react';

const Auth = () => {
    return (
        <div className="min-h-screen bg-[#F9F9F9] flex flex-col justify-center items-center p-6 font-['Inter',sans-serif]">
            {/* Minimalist Brand / Logo Area */}
            <div className="mb-12">
                <div className="w-12 h-12 bg-[#121212] rounded-lg mx-auto flex items-center justify-center shadow-sm">
                    <span className="text-white text-2xl font-bold tracking-tighter">A.</span>
                </div>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-[440px] bg-white rounded-xl border border-[#E5E5E5] shadow-[0_4px_30px_rgba(0,0,0,0.03)] p-12 text-center">
                <h1 className="text-[28px] font-semibold text-[#121212] tracking-tight mb-3">Welcome back</h1>
                <p className="text-[#6B6B6B] text-[15px] mb-12">Sign in to access your dashboard</p>
                
                <button 
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-[#E5E5E5] rounded-lg hover:bg-[#F9F9F9] hover:border-[#121212] transition-all duration-300 group shadow-sm"
                >
                    <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-[#121212] font-medium text-[15px] tracking-wide">Continue with Google</span>
                </button>

                <div className="mt-12 text-[13px] text-[#858383] leading-relaxed">
                    By continuing, you agree to our <br/>
                    <a href="#" className="text-[#121212] hover:underline underline-offset-4 decoration-[#E5E5E5] hover:decoration-[#121212] transition-colors">Terms of Service</a> and <a href="#" className="text-[#121212] hover:underline underline-offset-4 decoration-[#E5E5E5] hover:decoration-[#121212] transition-colors">Privacy Policy</a>.
                </div>
            </div>
        </div>
    );
};

export default Auth;