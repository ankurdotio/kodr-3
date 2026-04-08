import React, { useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';

const Notification = () => {
    const { handleGetFollowRequests } = useUser();
    const followRequests = useSelector(state => state.user.followRequests);

    useEffect(() => {
        handleGetFollowRequests();
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-8 bg-[#f9f9f9] min-h-screen">
            <h1 className="text-2xl md:text-[2.75rem] font-semibold text-[#2d3435] mb-8 tracking-tight">Notifications</h1>

            <div className="space-y-6">
                <h2 className="text-[1.5rem] font-medium text-[#2d3435] mb-4">Follow Requests</h2>

                {followRequests && followRequests.length > 0 ? (
                    <div className="flex flex-col gap-6">
                        {followRequests.map((request) => (
                            <div
                                key={request._id}
                                className="flex items-center justify-between p-4 bg-[#ffffff] hover:bg-[#dde4e5] transition-colors duration-200 rounded-lg group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-[#ebeeef]">
                                        <img
                                            src={request.follower.profilePicture}
                                            alt={request.follower.username}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <Link to={`/profile/${request.follower.username}`} className="text-[0.875rem] font-semibold text-[#2d3435] hover:underline">
                                            {request.follower.username}
                                        </Link>
                                        <span className="text-[0.875rem] text-[#5a6061]">requested to follow you</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="px-4 py-2 bg-[#5e5e5e] hover:bg-[#525252] text-[#f8f8f8] text-[0.875rem] font-medium rounded-md transition-colors duration-200">
                                        Confirm
                                    </button>
                                    <button className="px-4 py-2 bg-[#ebeeef] hover:bg-[#dde4e5] text-[#2d3435] text-[0.875rem] font-medium rounded-md transition-colors duration-200">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-[#5a6061]">
                        <p className="text-[0.875rem]">No pending follow requests.</p>
                    </div>
                )}
            </div>

            {/* Divider intentionally left out per design system, using margin for spacing */}
            <div className="mt-16">
                <h2 className="text-[1.5rem] font-medium text-[#2d3435] mb-4">Earlier</h2>
                <div className="flex flex-col items-center justify-center py-16 text-[#5a6061]">
                    <p className="text-[0.875rem]">No earlier notifications.</p>
                </div>
            </div>
        </div>
    );
};

export default Notification;