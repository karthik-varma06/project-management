import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import MyTasksSidebar from './MyTasksSidebar'
import ProjectSidebar from './ProjectsSidebar'
import WorkspaceDropdown from './WorkspaceDropdown'
import { HiOutlineSquares2X2, HiOutlineUsers, HiOutlineFolderOpen, HiOutlineCog6Tooth, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import { useClerk } from '@clerk/clerk-react'

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { openUserProfile, signOut } = useClerk();

    const menuItems = [
        { name: 'Dashboard', href: '/', icon: HiOutlineSquares2X2 },
        { name: 'Projects', href: '/projects', icon: HiOutlineFolderOpen },
        { name: 'Team', href: '/team', icon: HiOutlineUsers },
    ]

    const sidebarRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsSidebarOpen]);

    return (
        <div
            ref={sidebarRef}
            className={`z-20 bg-[var(--bg-elevated)] min-w-72 flex flex-col h-screen border-r border-[var(--surface-border)] max-sm:absolute transition-all ${isSidebarOpen ? 'left-0' : '-left-full'}`}
        >
            <WorkspaceDropdown />
            <div className='flex-1 overflow-y-auto no-scrollbar flex flex-col px-3 pb-4'>
                <div className='rounded-2xl border border-[var(--surface-border)] p-2 bg-white/30 dark:bg-white/5'>
                    {menuItems.map((item) => (
                        <NavLink
                            to={item.href}
                            key={item.name}
                            className={({ isActive }) => `flex items-center gap-3 py-2.5 px-3 text-[var(--text-main)] cursor-pointer rounded-xl transition-all ${
                                isActive
                                    ? 'bg-gradient-to-r from-[var(--brand-a)]/20 to-[var(--brand-b)]/20 ring-1 ring-[var(--brand-a)]/30'
                                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                            }`}
                        >
                            <item.icon size={17} />
                            <p className='text-sm truncate'>{item.name}</p>
                        </NavLink>
                    ))}
                    <button
                        className='flex w-full items-center gap-3 py-2.5 px-3 text-[var(--text-main)] cursor-pointer rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all'
                        onClick={openUserProfile}
                    >
                        <HiOutlineCog6Tooth size={17} />
                        <p className='text-sm truncate'>Settings</p>
                    </button>

                    <button
                        className='mt-1 flex w-full items-center gap-3 py-2.5 px-3 text-rose-500 cursor-pointer rounded-xl hover:bg-rose-500 hover:text-white transition-all'
                        onClick={async () => await signOut()}
                    >
                        <HiOutlineArrowRightOnRectangle size={17} />
                        <p className='text-sm truncate'>Log out</p>
                    </button>
                </div>

                <MyTasksSidebar />
                <ProjectSidebar />
            </div>
        </div>
    )
}

export default Sidebar
