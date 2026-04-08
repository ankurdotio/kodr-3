import React from 'react';
import { NavLink } from 'react-router';
import {
    Home,
    Search,
    PlusSquare,
    Bell,
    User,
    MessageCircle,
    Menu
} from 'lucide-react';
import LoggedInUserTile from '../../features/users/components/LoggedInUserTile';

const Sidebar = () => {

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Search', path: '/search', icon: Search },
        { name: 'Messages', path: '/messages', icon: MessageCircle },
        { name: 'Notifications', path: '/notifications', icon: Bell },
        { name: 'Create', path: '/create', icon: PlusSquare },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <nav className="fixed left-0 top-0 hidden md:flex flex-col w-[244px] h-screen border-r border-zinc-200 bg-white px-3 py-6 z-50">
                <div className="mb-8 px-3">
                    {/* Placeholder Instagram Logo */}
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        KodrGram
                    </h1>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group ${isActive
                                        ? 'font-bold'
                                        : 'font-normal hover:bg-zinc-50'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="relative group-hover:scale-110 transition-transform duration-200">
                                            <Icon strokeWidth={isActive ? 2.5 : 1.5} size={26} className="text-zinc-900" />
                                        </div>
                                        <span className="text-base text-zinc-900 hidden lg:block tracking-wide">
                                            {item.name}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>

                <div className="mt-auto flex-col gap-2">
                    <LoggedInUserTile />
                    <button className="flex w-full items-center gap-4 p-3 rounded-lg hover:bg-zinc-50 transition-all duration-200 group">
                        <div className="relative group-hover:scale-110 transition-transform duration-200">
                            <Menu strokeWidth={1.5} size={26} className="text-zinc-900" />
                        </div>
                        <span className="text-base text-zinc-900 hidden lg:block tracking-wide">More</span>
                    </button>
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-zinc-200 px-4 py-2 z-50 pb-[env(safe-area-inset-bottom)]">
                <div className="flex justify-between items-center h-12">
                    {navItems.filter(item => [ 'Home', 'Search', 'Create', 'Messages', 'Profile' ].includes(item.name)).map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className="p-2 transition-transform active:scale-95"
                            >
                                {({ isActive }) => (
                                    <Icon strokeWidth={isActive ? 2.5 : 1.5} size={26} className="text-zinc-900" />
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};

export default Sidebar;
