import { Search, Sun, Moon, Bell, Sparkles, LogOut } from 'lucide-react'
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../features/themeSlice'
import Avatar from './common/Avatar'
import { useClerk, useUser } from '@clerk/clerk-react'

const Navbar = ({ setIsSidebarOpen }) => {
    const dispatch = useDispatch();
    const { theme } = useSelector(state => state.theme);
    const { user } = useUser();
    const { openUserProfile, signOut } = useClerk();

    return (
        <div className="w-full border-b border-[var(--surface-border)] bg-[var(--bg-elevated)]/90 backdrop-blur-xl px-6 xl:px-16 py-3 flex-shrink-0">
            <div className="flex items-center justify-between max-w-6xl mx-auto gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="sm:hidden p-2 rounded-xl transition text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5" >
                        <HiOutlineAdjustmentsHorizontal size={18} />
                    </button>

                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] size-4" />
                        <input
                            type="text"
                            placeholder="Search projects, tasks, members..."
                            className="pl-10 pr-4 py-2.5 w-full bg-transparent border border-[var(--surface-border)] rounded-xl text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-a)]/40"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button className="size-9 rounded-xl border border-[var(--surface-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <Bell className='size-4' />
                    </button>

                    <button
                        onClick={async () => await signOut()}
                        className="size-9 rounded-xl border border-[var(--surface-border)] flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition"
                        title="Log out"
                    >
                        <LogOut className='size-4' />
                    </button>

                    <button onClick={() => dispatch(toggleTheme())} className="size-9 rounded-xl border border-[var(--surface-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition">
                        {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4 text-amber-400" />}
                    </button>

                    <button onClick={openUserProfile} className="group flex items-center gap-2 rounded-xl border border-[var(--surface-border)] px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <Avatar
                            src={user?.imageUrl}
                            name={user?.fullName}
                            email={user?.primaryEmailAddress?.emailAddress}
                            className="size-8"
                            textClassName="text-[11px]"
                            alt="profile"
                        />
                        <div className="hidden md:block text-left leading-tight">
                            <p className='text-xs text-[var(--text-main)] font-medium max-w-32 truncate'>
                                {user?.firstName || 'Profile'}
                            </p>
                            <p className='text-[10px] text-[var(--text-muted)] flex items-center gap-1'>
                                <Sparkles className='size-3' /> Open profile
                            </p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navbar
