import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, Volume2, VolumeX } from 'lucide-react';

const mockData = {
  "posts": [
    {
      "_id": "69ca2588c933db9a7851dc63",
      "caption": "test caption",
      "author": {
        "profilePicture": "https://ik.imagekit.io/hnoglyswo0/avatar-photo-default-user-icon-600nw-2558759027.webp?updatedAt=1773986129958",
        "_id": "69c4e5a910515101f01efeb5",
        "username": "test_2"
      },
      "media": [
        {
          "url": "https://ik.imagekit.io/hnoglyswo0/kodr-3/insta/posts/13103056_720_1280_30fps_U0V5X9jf2.mp4",
          "media_type": "video",
          "_id": "69ca2588c933db9a7851dc64"
        },
        {
          "url": "https://ik.imagekit.io/hnoglyswo0/kodr-3/insta/posts/deadpool_uDzSZ_8-H.jpg",
          "media_type": "image",
          "_id": "69ca2588c933db9a7851dc65"
        },
        {
          "url": "https://ik.imagekit.io/hnoglyswo0/kodr-3/insta/posts/doom_yYXq-DH18Q.jpg",
          "media_type": "image",
          "_id": "69ca2588c933db9a7851dc66"
        },
        {
          "url": "https://ik.imagekit.io/hnoglyswo0/kodr-3/insta/posts/thor_Ty_feCF90.jpg",
          "media_type": "image",
          "_id": "69ca2588c933db9a7851dc67"
        }
      ],
      "createdAt": "2026-03-30T07:26:00.468Z"
    }
  ]
};

const VideoPlayer = ({ url }) => {
  const [isMuted, setIsMuted] = useState(true);
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

const PostCard = ({ post }) => {
  // Simple state to track active carousel slide for indicators
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    if (!scrollRef.current) return;
    const scrollPosition = e.target.scrollLeft;
    const slideWidth = e.target.offsetWidth;
    // Calculate the closest visible slide based on scroll width vs total width
    const currentIndex = Math.round(scrollPosition / slideWidth);
    if (currentIndex !== activeSlide) {
       setActiveSlide(currentIndex);
    }
  };

  return (
    <article className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] mb-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 px-5">
        <div className="flex items-center space-x-3">
          <div className="p-[2px] rounded-full bg-zinc-50 border border-zinc-100">
             <img 
               src={post.author.profilePicture} 
               alt={post.author.username} 
               className="w-10 h-10 rounded-full object-cover"
             />
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-900 font-semibold text-[15px] leading-tight tracking-tight">
              {post.author.username}
            </span>
          </div>
        </div>
        <button className="text-zinc-400 hover:text-zinc-600 transition-colors">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>

      {/* Media Carousel */}
      <div className="w-full relative">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] aspect-[4/5] bg-zinc-50"
        >
          {post.media.map((item, index) => (
            <div key={item._id} className="w-full h-full flex-none snap-center relative break-inside-avoid">
              {item.media_type === 'video' ? (
                <VideoPlayer url={item.url} />
              ) : (
                <img 
                  src={item.url} 
                  alt={`Post Content ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Bar & Caption */}
      <div className="p-5 pt-4">
        <div className="flex justify-between items-center mb-4 relative">
          <div className="flex items-center space-x-4">
            <button className="text-zinc-900 hover:text-rose-600 transition-colors">
              <Heart strokeWidth={1.5} size={26} />
            </button>
            <button className="text-zinc-900 hover:text-zinc-600 transition-colors">
              <MessageCircle strokeWidth={1.5} size={26} />
            </button>
            <button className="text-zinc-900 hover:text-zinc-600 transition-colors">
              <Send strokeWidth={1.5} size={26} />
            </button>
          </div>
          
          {/* Carousel dots in the center of the action bar */}
          {post.media.length > 1 && (
            <div className="absolute left-1/2 -translate-x-1/2 flex space-x-1.5">
              {post.media.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === activeSlide ? 'w-1.5 bg-blue-500' : 'w-1.5 bg-zinc-300'}`} 
                />
              ))}
            </div>
          )}

          <button className="text-zinc-900 hover:text-zinc-600 transition-colors">
            <Bookmark strokeWidth={1.5} size={26} />
          </button>
        </div>

        <div className="text-[15px] leading-relaxed text-zinc-800">
          <span className="font-semibold text-zinc-900 mr-2">{post.author.username}</span>
          <span>{post.caption}</span>
        </div>
        
        <div className="mt-2 text-xs text-zinc-400 font-medium tracking-wide uppercase">
          {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
        </div>
      </div>
    </article>
  );
};

const Home = () => {
    return (
        <div className="min-h-screen bg-zinc-50 pt-8 pb-20">
            <main className="max-w-[470px] mx-auto w-full px-4 sm:px-0">
                {mockData.posts.map(post => (
                    <PostCard key={post._id} post={post} />
                ))}
            </main>
        </div>
    );
};

export default Home;