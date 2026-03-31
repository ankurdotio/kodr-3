import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from "lucide-react";


const VideoPlayer = ({ url }) => {
    const [ isMuted, setIsMuted ] = useState(true);
    const videoRef = useRef(null);

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log('Autoplay prevented', e));
        }
    }, []);

    return (
        <div className="relative w-full h-full bg-zinc-900 flex items-center justify-center">
            <video
                ref={videoRef}
                src={url}
                autoPlay
                loop
                playsInline
                muted={isMuted}
                className="object-cover w-full h-full max-h-[600px]"
            />
            <button
                onClick={toggleMute}
                className="absolute bottom-4 right-4 p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors z-10"
            >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
        </div>
    );
};

export default VideoPlayer