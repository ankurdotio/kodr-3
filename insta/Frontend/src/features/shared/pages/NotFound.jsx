import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'

// ── Pixel Ghost sprite frames (CSS-drawn) ──────────────────────────────────
const GhostSprite = ({ frame }) => (
    <div className="relative select-none" style={{ imageRendering: 'pixelated' }}>
        <svg width="64" height="64" viewBox="0 0 8 8" style={{ imageRendering: 'pixelated' }}>
            {/* Body */}
            <rect x="1" y="2" width="6" height="5" fill="#a78bfa" />
            {/* Head arc */}
            <rect x="2" y="1" width="4" height="1" fill="#a78bfa" />
            <rect x="1" y="1" width="1" height="1" fill="#a78bfa" />
            <rect x="6" y="1" width="1" height="1" fill="#a78bfa" />
            {/* Eyes */}
            <rect x="2" y="3" width="1" height="1" fill={frame % 4 === 0 ? "#a78bfa" : "white"} />
            <rect x="5" y="3" width="1" height="1" fill={frame % 4 === 0 ? "#a78bfa" : "white"} />
            {/* Pupils */}
            <rect x="2" y="3" width="1" height="1" fill="white" />
            <rect x="5" y="3" width="1" height="1" fill="white" />
            <rect x={frame % 2 === 0 ? "2" : "2"} y="3" width="1" height="1" fill="#1e1b4b" />
            <rect x={frame % 2 === 0 ? "5" : "5"} y="3" width="1" height="1" fill="#1e1b4b" />
            {/* Wavy bottom */}
            {frame % 2 === 0 ? (
                <>
                    <rect x="1" y="7" width="2" height="1" fill="#a78bfa" />
                    <rect x="4" y="7" width="2" height="1" fill="#a78bfa" />
                </>
            ) : (
                <>
                    <rect x="2" y="7" width="2" height="1" fill="#a78bfa" />
                    <rect x="5" y="7" width="2" height="1" fill="#a78bfa" />
                </>
            )}
        </svg>
    </div>
)

// ── Floating particles ─────────────────────────────────────────────────────
const Particle = ({ style }) => (
    <div
        className="absolute w-1 h-1 rounded-full bg-violet-400 opacity-60"
        style={{ ...style, animation: `float-particle ${style.duration}s ease-in-out infinite` }}
    />
)

// ── Score display ──────────────────────────────────────────────────────────
const PixelScore = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <span className="text-violet-400 text-xs font-mono tracking-widest uppercase">{label}</span>
        <span className="text-white font-mono text-2xl font-bold tabular-nums" style={{ textShadow: '0 0 12px #a78bfa' }}>
            {String(value).padStart(6, '0')}
        </span>
    </div>
)

// ── Main Component ─────────────────────────────────────────────────────────
const NotFound = () => {
    const navigate = useNavigate()
    const [frame, setFrame] = useState(0)
    const [glitch, setGlitch] = useState(false)
    const [score, setScore] = useState(404)
    const [lives, setLives] = useState(3)
    const [ghostX, setGhostX] = useState(50)
    const [ghostDir, setGhostDir] = useState(1)
    const [caught, setCaught] = useState(false)
    const [particles] = useState(() =>
        Array.from({ length: 20 }, (_, i) => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: 3 + Math.random() * 4,
            animationDelay: `${Math.random() * 4}s`,
        }))
    )
    const ghostRef = useRef(null)
    const animRef = useRef(null)
    const lastTimeRef = useRef(0)

    // Animate ghost horizontally
    const animateGhost = useCallback((timestamp) => {
        if (timestamp - lastTimeRef.current > 16) {
            setGhostX(prev => {
                let next = prev + ghostDir * 0.4
                if (next > 90 || next < 10) {
                    setGhostDir(d => -d)
                }
                return Math.max(10, Math.min(90, next))
            })
            lastTimeRef.current = timestamp
        }
        animRef.current = requestAnimationFrame(animateGhost)
    }, [ghostDir])

    // Sprite frame ticker
    useEffect(() => {
        const t = setInterval(() => setFrame(f => f + 1), 300)
        return () => clearInterval(t)
    }, [])

    // Ghost movement
    useEffect(() => {
        animRef.current = requestAnimationFrame(animateGhost)
        return () => cancelAnimationFrame(animRef.current)
    }, [animateGhost])

    // Glitch effect
    useEffect(() => {
        const glitchInterval = setInterval(() => {
            setGlitch(true)
            setTimeout(() => setGlitch(false), 150)
        }, 2800)
        return () => clearInterval(glitchInterval)
    }, [])

    // Score ticker
    useEffect(() => {
        const t = setInterval(() => {
            setScore(s => s + 1)
        }, 500)
        return () => clearInterval(t)
    }, [])

    // Catch the ghost!
    const handleCatchGhost = () => {
        if (caught) return
        setCaught(true)
        setScore(s => s + 1337)
        setLives(l => Math.min(l + 1, 5))
        setTimeout(() => {
            setCaught(false)
        }, 800)
    }

    const heartIcons = Array.from({ length: 5 }, (_, i) => i < lives)

    return (
        <div className="min-h-screen bg-[#0d0a1e] flex flex-col items-center justify-center px-4 overflow-hidden relative">
            {/* CSS Keyframes injected */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

                @keyframes float-particle {
                    0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
                    50% { transform: translateY(-20px) scale(1.4); opacity: 0.9; }
                }
                @keyframes glitch-1 {
                    0%   { transform: translate(0); }
                    25%  { transform: translate(-4px, 2px); }
                    50%  { transform: translate(4px, -2px); }
                    75%  { transform: translate(-2px, 4px); }
                    100% { transform: translate(0); }
                }
                @keyframes scanline {
                    0%   { background-position: 0 0; }
                    100% { background-position: 0 100%; }
                }
                @keyframes neon-pulse {
                    0%, 100% { text-shadow: 0 0 10px #a78bfa, 0 0 30px #a78bfa, 0 0 60px #7c3aed; }
                    50%      { text-shadow: 0 0 20px #c4b5fd, 0 0 60px #a78bfa, 0 0 100px #7c3aed; }
                }
                @keyframes ghost-float {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-12px); }
                }
                @keyframes border-flicker {
                    0%,97%,100% { opacity: 1; }
                    98%          { opacity: 0.3; }
                    99%          { opacity: 0.7; }
                }
                @keyframes star-twinkle {
                    0%,100% { opacity: 0.2; transform: scale(1); }
                    50%      { opacity: 1; transform: scale(1.5); }
                }
                @keyframes caught-flash {
                    0%   { transform: scale(1); filter: brightness(1); }
                    50%  { transform: scale(1.4); filter: brightness(2) hue-rotate(60deg); }
                    100% { transform: scale(1); filter: brightness(1); }
                }
                .pixel-font { font-family: 'Press Start 2P', monospace; }
                .neon-text { animation: neon-pulse 2s ease-in-out infinite; }
                .ghost-float { animation: ghost-float 2s ease-in-out infinite; }
                .glitch-text { animation: glitch-1 0.15s steps(1) forwards; }
                .caught-anim { animation: caught-flash 0.8s ease forwards; }
                .scanlines::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        rgba(0,0,0,0.08) 2px,
                        rgba(0,0,0,0.08) 4px
                    );
                    pointer-events: none;
                }
            `}</style>

            {/* Stars background */}
            {particles.map((p, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: i % 3 === 0 ? '2px' : '1px',
                        height: i % 3 === 0 ? '2px' : '1px',
                        animation: `star-twinkle ${p.duration}s ease-in-out infinite`,
                        animationDelay: p.animationDelay,
                    }}
                />
            ))}

            {/* CRT scanline overlay */}
            <div className="scanlines absolute inset-0 pointer-events-none z-10" />

            {/* HUD top bar */}
            <div className="absolute top-0 left-0 right-0 px-6 py-3 flex items-center justify-between z-20"
                style={{ borderBottom: '1px solid rgba(167,139,250,0.2)', background: 'rgba(13,10,30,0.8)', backdropFilter: 'blur(8px)' }}>
                <div className="flex items-center gap-3">
                    <span className="pixel-font text-violet-400 text-[8px]">LIVES</span>
                    <div className="flex gap-1">
                        {heartIcons.map((alive, i) => (
                            <span key={i} className={`text-sm transition-all duration-300 ${alive ? 'text-pink-400' : 'text-gray-700'}`}>♥</span>
                        ))}
                    </div>
                </div>

                <PixelScore value={score} label="SCORE" />

                <div className="pixel-font text-[8px] text-violet-400">
                    LVL <span className="text-white">404</span>
                </div>
            </div>

            {/* Main content */}
            <div className="relative z-20 flex flex-col items-center gap-8 mt-10">

                {/* Glitchy 404 */}
                <div className="relative select-none">
                    <div className={`pixel-font neon-text text-[clamp(80px,18vw,160px)] font-black text-violet-400 leading-none ${glitch ? 'glitch-text' : ''}`}
                        style={{ letterSpacing: '-4px' }}>
                        404
                    </div>
                    {/* Glitch duplicates */}
                    {glitch && (
                        <>
                            <div className="pixel-font absolute inset-0 text-[clamp(80px,18vw,160px)] font-black leading-none text-cyan-400 opacity-60"
                                style={{ letterSpacing: '-4px', transform: 'translate(4px, -2px)', clipPath: 'inset(30% 0 50% 0)' }}>
                                404
                            </div>
                            <div className="pixel-font absolute inset-0 text-[clamp(80px,18vw,160px)] font-black leading-none text-pink-500 opacity-60"
                                style={{ letterSpacing: '-4px', transform: 'translate(-4px, 2px)', clipPath: 'inset(60% 0 10% 0)' }}>
                                404
                            </div>
                        </>
                    )}
                </div>

                {/* Subtitle */}
                <div className="text-center space-y-1">
                    <p className="pixel-font text-[10px] text-violet-300 tracking-widest uppercase">
                        LEVEL NOT FOUND
                    </p>
                    <p className="text-gray-400 text-sm font-mono mt-2">
                        You wandered into the void. The page you're looking for doesn't exist.
                    </p>
                </div>

                {/* Ghost game area */}
                <div
                    className="relative w-full max-w-md h-28 rounded-xl overflow-hidden cursor-pointer select-none"
                    style={{
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(13,10,30,0.95))',
                        border: '1px solid rgba(167,139,250,0.25)',
                        animation: 'border-flicker 6s infinite',
                    }}
                    onClick={handleCatchGhost}
                    title="Catch the ghost!"
                >
                    {/* Track label */}
                    <div className="absolute top-2 left-3 pixel-font text-[7px] text-violet-600 uppercase tracking-widest">
                        &gt; Catch the ghost for bonus pts
                    </div>

                    {/* Ghost */}
                    <div
                        className={`absolute bottom-4 ghost-float transition-none ${caught ? 'caught-anim' : ''}`}
                        style={{ left: `${ghostX}%`, transform: `translateX(-50%) scaleX(${ghostDir})` }}
                    >
                        <GhostSprite frame={frame} />
                        {caught && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 pixel-font text-[8px] text-yellow-300 whitespace-nowrap"
                                style={{ textShadow: '0 0 8px #fde047' }}>
                                +1337!
                            </div>
                        )}
                    </div>

                    {/* Ground pixels */}
                    <div className="absolute bottom-0 left-0 right-0 h-1"
                        style={{ background: 'repeating-linear-gradient(90deg, rgba(167,139,250,0.3) 0px, rgba(167,139,250,0.3) 8px, transparent 8px, transparent 16px)' }} />
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-md">
                    <button
                        onClick={() => navigate('/')}
                        className="pixel-font flex-1 text-[9px] py-4 px-6 rounded-lg text-white uppercase tracking-widest transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                        style={{
                            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                            boxShadow: '0 0 20px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                            border: '1px solid rgba(167,139,250,0.4)',
                        }}
                    >
                        ▶ Return Home
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="pixel-font flex-1 text-[9px] py-4 px-6 rounded-lg uppercase tracking-widest transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(167,139,250,0.3)',
                            color: '#a78bfa',
                            boxShadow: '0 0 10px rgba(167,139,250,0.1)',
                        }}
                    >
                        ◀ Go Back
                    </button>
                </div>

                {/* Insert coin prompt */}
                <div className="pixel-font text-[8px] text-gray-600 uppercase tracking-widest"
                    style={{ animation: 'neon-pulse 1.2s ease-in-out infinite' }}>
                    — Insert coin to continue —
                </div>

                {/* Keyboard hint */}
                <div className="flex gap-4 items-center">
                    {['ESC', 'CLICK', 'HOME'].map((key, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <div className="px-3 py-1.5 font-mono text-[10px] text-violet-300 rounded"
                                style={{
                                    background: 'rgba(167,139,250,0.08)',
                                    border: '1px solid rgba(167,139,250,0.25)',
                                    boxShadow: '0 2px 0 rgba(0,0,0,0.5)',
                                }}>
                                {key}
                            </div>
                            <span className="text-[9px] text-gray-600 font-mono">
                                {i === 0 ? 'pause' : i === 1 ? 'ghost' : 'base'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Corner decorations */}
            <div className="absolute bottom-4 left-4 pixel-font text-[7px] text-violet-800 z-20">
                © INSTAVERSE ENG
            </div>
            <div className="absolute bottom-4 right-4 pixel-font text-[7px] text-violet-800 z-20">
                v1.0.404
            </div>
        </div>
    )
}

export default NotFound