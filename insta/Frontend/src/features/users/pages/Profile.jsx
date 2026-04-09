import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useUser } from '../hooks/useUser'
import { Grid, Film, UserSquare } from 'lucide-react'

const Profile = () => {

    const { handleGetProfileData } = useUser()
    const user = useSelector((store) => store.auth.user)
    const profile = useSelector(store => store.user.profile)
    const [activeTab, setActiveTab] = useState('posts')

    useEffect(() => {
        handleGetProfileData()
    }, [handleGetProfileData])

    if (!user || !profile) {
        return (
            <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
                <div className="animate-pulse w-8 h-8 rounded-full bg-gray-300"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] text-[#2d3435] font-sans selection:bg-[#c1000a] selection:text-white pb-20">
            <div className="max-w-4xl mx-auto px-4 pt-16 sm:px-6 lg:px-8">
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-10 sm:gap-16 mb-12">
                    <div className="flex-shrink-0">
                        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#ffffff] bg-[#f9f9f9] shadow-[0_8px_32px_rgba(45,52,53,0.06)]">
                            <img 
                                src={user?.profilePicture} 
                                alt={user?.username} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                            <h1 className="text-2xl sm:text-[2.75rem] font-medium tracking-tight text-[#2d3435] leading-none">
                                {user?.username}
                            </h1>
                            <button className="mt-2 sm:mt-0 sm:ml-4 px-6 py-2.5 bg-[#5e5e5e] hover:bg-[#525252] text-[#f8f8f8] text-sm font-medium rounded-md transition-colors duration-200 shadow-[0_2px_10px_rgba(45,52,53,0.1)] w-full sm:w-auto">
                                Edit Profile
                            </button>
                        </div>

                        <div className="flex gap-8 mb-8 justify-center sm:justify-start">
                            <div className="flex gap-1.5 items-baseline">
                                <span className="text-lg font-semibold">{profile?.postsCount || 0}</span>
                                <span className="text-sm font-medium text-[#5a6061]">posts</span>
                            </div>
                            <div className="flex gap-1.5 items-baseline">
                                <span className="text-lg font-semibold">{profile?.followersCount || 0}</span>
                                <span className="text-sm font-medium text-[#5a6061]">followers</span>
                            </div>
                            <div className="flex gap-1.5 items-baseline">
                                <span className="text-lg font-semibold">{profile?.followingCount || 0}</span>
                                <span className="text-sm font-medium text-[#5a6061]">following</span>
                            </div>
                        </div>

                        <div className="space-y-1 text-center sm:text-left">
                            <h2 className="text-sm font-semibold tracking-wide">{user?.fullname}</h2>
                            <p className="text-[0.875rem] leading-relaxed text-[#5a6061] max-w-md mx-auto sm:mx-0">
                                {user?.bio || "Digital curator."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center border-t border-[#ebeeef] mb-6">
                    <button 
                        onClick={() => setActiveTab('posts')}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-[0.75rem] font-semibold uppercase tracking-widest transition-colors ${activeTab === 'posts' ? 'text-[#2d3435] border-t-[1.5px] border-[#2d3435] -mt-[1.5px]' : 'text-[#9c9d9d] hover:text-[#5a6061]'}`}>
                        <Grid size={16} strokeWidth={1.5} />
                        <span className="hidden sm:inline">Posts</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('reels')}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-[0.75rem] font-semibold uppercase tracking-widest transition-colors ${activeTab === 'reels' ? 'text-[#2d3435] border-t-[1.5px] border-[#2d3435] -mt-[1.5px]' : 'text-[#9c9d9d] hover:text-[#5a6061]'}`}>
                        <Film size={16} strokeWidth={1.5} />
                        <span className="hidden sm:inline">Reels</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('tagged')}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-[0.75rem] font-semibold uppercase tracking-widest transition-colors ${activeTab === 'tagged' ? 'text-[#2d3435] border-t-[1.5px] border-[#2d3435] -mt-[1.5px]' : 'text-[#9c9d9d] hover:text-[#5a6061]'}`}>
                        <UserSquare size={16} strokeWidth={1.5} />
                        <span className="hidden sm:inline">Tagged</span>
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'posts' && (
                    <>
                        <div className="grid grid-cols-3 gap-1 sm:gap-4 md:gap-6">
                            {profile?.posts?.map((post) => (
                                <div key={post._id} className="aspect-[3/4] bg-[#ffffff] sm:rounded-lg overflow-hidden group relative cursor-pointer shadow-[0_2px_8px_rgba(45,52,53,0.02)]">
                                    <img 
                                        src={post.media[0]?.url} 
                                        alt={post.caption || 'Post'} 
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-[#2d3435]/10 transition-colors duration-300" />
                                </div>
                            ))}
                        </div>

                        {(!profile?.posts || profile.posts.length === 0) && (
                            <div className="mt-20 text-center">
                                <p className="text-[0.875rem] text-[#5a6061]">No posts yet.</p>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'reels' && (
                    <div className="mt-20 text-center">
                        <p className="text-[0.875rem] text-[#5a6061]">No reels yet.</p>
                    </div>
                )}

                {activeTab === 'tagged' && (
                    <div className="mt-20 text-center">
                        <p className="text-[0.875rem] text-[#5a6061]">Photos and videos of you will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile