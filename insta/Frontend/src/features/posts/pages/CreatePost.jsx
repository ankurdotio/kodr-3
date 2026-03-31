import React, { useState } from 'react';
import { ImagePlus, X, Upload } from 'lucide-react';

const CreatePost = () => {
    const [ dragActive, setDragActive ] = useState(false);
    const [ caption, setCaption ] = useState('');

    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[ 0 ]) {
            // handle file
        }
    };

    return (
        <div className="w-full max-w-4xl h-full  mx-auto pb-12 min-h-[600px] flex items-center justify-center pt-8">
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] w-full overflow-hidden border border-zinc-100 flex flex-col md:flex-row min-h-[550px]">

                {/* Visual Area for Media Upload */}
                <div
                    className={`flex-1 flex flex-col items-center justify-center p-12 transition-colors duration-300 relative border-b md:border-b-0 md:border-r border-zinc-100 ${dragActive ? 'bg-blue-50/50' : 'bg-zinc-50/50 hover:bg-zinc-50'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className="absolute inset-4 border-2 border-dashed border-zinc-200 rounded-2xl pointer-events-none transition-colors duration-300 peer-hover:border-blue-400" />

                    <div className="relative text-center w-full max-w-sm">
                        <div className="mx-auto w-24 h-24 mb-6 rounded-full bg-white shadow-sm flex items-center justify-center animate-bounce-slow">
                            <ImagePlus strokeWidth={1} size={42} className="text-zinc-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-zinc-900 mb-3 tracking-tight">Drag photos and videos here</h3>
                        <p className="text-zinc-500 mb-8 leading-relaxed">
                            Support for JPG, PNG, and MP4 files. Maximum size 50MB.
                        </p>

                        <label className="relative overflow-hidden inline-flex items-center justify-center px-8 py-3.5 font-medium text-white bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 active:scale-95 transition-all shadow-md hover:shadow-lg shadow-blue-500/20">
                            <span>Select from computer</span>
                            <input type="file" className="absolute opacity-0 w-full h-full cursor-pointer" accept="image/*,video/*" multiple />
                        </label>
                    </div>
                </div>

                {/* Content Area for Details */}
                <div className="w-full md:w-[350px] lg:w-[400px] flex flex-col bg-white">
                    <div className="p-4 border-b border-zinc-100 flex items-center justify-center relative bg-white/50 backdrop-blur-md sticky top-0 z-10">
                        <h2 className="text-zinc-900 font-semibold tracking-wide">Create new post</h2>
                        <button className="absolute right-4 text-blue-500 font-medium text-sm hover:text-blue-700 transition-colors">
                            Share
                        </button>
                    </div>

                    <div className="p-6 flex-1 flex flex-col overflow-y-auto">
                        <div className="flex items-center mb-6">
                            <div className="w-9 h-9 rounded-full bg-zinc-200 overflow-hidden border border-zinc-100">
                                {/* Current User Placeholder */}
                                <div className="w-full h-full bg-gradient-to-tr from-rose-100 to-teal-100"></div>
                            </div>
                            <span className="font-semibold text-zinc-900 text-[15px] ml-3">current_user</span>
                        </div>

                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Write a caption..."
                            className="w-full flex-1 resize-none bg-transparent outline-none text-zinc-800 placeholder-zinc-400 text-base leading-relaxed"
                            rows={8}
                        />

                        <div className="mt-auto pt-6 border-t border-zinc-100">
                            <div className="flex justify-between items-center text-zinc-400">
                                <button className="hover:text-zinc-600 transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                                </button>
                                <span className="text-xs font-medium">{caption.length}/2200</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
