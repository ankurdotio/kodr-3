import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../navigation/Sidebar';

const AppLayout = () => {
    return (
        <div className="bg-zinc-50 min-h-screen md:ps-[244px] w-full">
            {/* Navigation (Sidebar Desktop / Bottom Bar Mobile) */}
            <Sidebar />

            {/* pb-[64px] adds bottom margin identical to the mobile bottom bar height */}
            <main className="md:pb-0 h-full flex justify-center w-full">
                <div className="w-full h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
