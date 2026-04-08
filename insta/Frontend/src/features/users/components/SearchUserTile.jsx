import React from 'react'
import { useUser } from '../hooks/useUser'
import { useSelector } from 'react-redux'

const SearchUserTile = ({ user }) => {

    const { handleFollowUser } = useUser()
    const requested = useSelector(state => state.user.requested)

    const handleClick = async (userId) => {
        await handleFollowUser({ userId })
    }

    return (
        <div key={user._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f2f4f4] transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#ebeeef] border-2 border-white shadow-sm shrink-0">
                    <img
                        src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username || 'User'}&background=ebeeef&color=5e5e5e`}
                        alt={user.username}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-[15px] text-[#2d3435] leading-tight group-hover:underline">
                        {user.username}
                    </span>
                    {user.fullname && (
                        <span className="text-[13px] text-[#5a6061] mt-0.5">
                            {user.fullname}
                        </span>
                    )}
                </div>
            </div>

            <button
                onClick={() => { handleClick(user._id) }}
                className="bg-[#5e5e5e] hover:bg-[#525252] text-white px-5 py-1.5 cursor-pointer rounded-lg text-[14px] font-medium transition-colors shadow-sm active:scale-95">
                {requested.includes(user._id) || user.followStatus == "requested" ? "requested" : (user.followStatus == "following" ? "following" : "follow")}
            </button>
        </div>
    )
}

export default SearchUserTile