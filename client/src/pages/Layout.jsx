import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadTheme } from '../features/themeSlice'
import { fetchWorkspaces } from "../features/workspaceSlice";
import { Loader2Icon, Sparkles, ShieldCheck, Workflow } from 'lucide-react'
import { useUser, useAuth , SignIn, SignUp, CreateOrganization } from '@clerk/clerk-react'

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [showSignUp, setShowSignUp] = useState(false)

    const { loading, workspaces } = useSelector((state) => state.workspace)
    const dispatch = useDispatch()

    const { user, isLoaded } = useUser()
    const { getToken } = useAuth()

    // Hooks must always run
    useEffect(() => {
        dispatch(loadTheme())
    }, [dispatch])

    // Initial load of workspaces
    useEffect(() => {
        if(isLoaded && user && workspaces.length === 0){
            dispatch(fetchWorkspaces({getToken}))
        }
    }, [user , isLoaded])

    if (!isLoaded) {
        return (
            <div className='flex items-center justify-center h-screen bg-white dark:bg-zinc-950'>
                <Loader2Icon className="size-7 text-blue-500 animate-spin" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className='min-h-screen grid lg:grid-cols-2 bg-[var(--bg-main)] text-[var(--text-main)]'>
                <div className='hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 text-white'>
                    <div className='space-y-4'>
                        <p className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs'>
                            <Sparkles className='size-3.5' /> Project Management Pro
                        </p>
                        <h1 className='text-4xl font-semibold leading-tight'>
                            Plan faster. Collaborate better. Ship confidently.
                        </h1>
                        <p className='text-sm text-indigo-100 max-w-md'>
                            A modern command center for your projects, team communication, task tracking, and delivery milestones.
                        </p>
                    </div>
                    <div className='space-y-4'>
                        {[{icon: ShieldCheck, text: 'Secure authentication and organization access with Clerk'}, {icon: Workflow, text: 'Streamlined task workflows with analytics, calendar and discussion'}].map((item, idx) => (
                            <div key={idx} className='flex items-start gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm'>
                                <item.icon className='size-4 mt-0.5' />
                                <p className='text-sm text-indigo-100'>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex items-center justify-center p-6 sm:p-10'>
                    <div className='w-full max-w-md rounded-3xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] p-6 sm:p-8 shadow-[0_20px_55px_-25px_rgba(72,99,210,0.45)] dark:shadow-[0_20px_55px_-25px_rgba(7,14,30,0.9)]'>
                        <div className='mb-5'>
                            <h2 className='text-2xl font-semibold tracking-tight'>{showSignUp ? 'Create account' : 'Welcome back'}</h2>
                            <p className='text-sm text-[var(--text-muted)] mt-1'>
                                {showSignUp ? 'Start building with your team in minutes.' : 'Sign in to continue to your workspace.'}
                            </p>
                        </div>

                        {showSignUp ? (
                            <SignUp
                                appearance={{
                                    elements: {
                                        card: "shadow-none bg-transparent p-0",
                                        formButtonPrimary: "!bg-gradient-to-r !from-[var(--brand-a)] !to-[var(--brand-b)] hover:!opacity-90 !shadow-none",
                                        headerTitle: "hidden",
                                        headerSubtitle: "hidden",
                                        socialButtonsBlockButton: "!border !border-[var(--surface-border)] !bg-transparent",
                                        formFieldInput: "!bg-transparent !border !border-[var(--surface-border)]",
                                        footerActionText: "!text-[var(--text-muted)]",
                                    },
                                }}
                            />
                        ) : (
                            <SignIn
                                appearance={{
                                    elements: {
                                        card: "shadow-none bg-transparent p-0",
                                        formButtonPrimary: "!bg-gradient-to-r !from-[var(--brand-a)] !to-[var(--brand-b)] hover:!opacity-90 !shadow-none",
                                        headerTitle: "hidden",
                                        headerSubtitle: "hidden",
                                        socialButtonsBlockButton: "!border !border-[var(--surface-border)] !bg-transparent",
                                        formFieldInput: "!bg-transparent !border !border-[var(--surface-border)]",
                                        footerActionText: "!text-[var(--text-muted)]",
                                    },
                                }}
                            />
                        )}

                        <button onClick={() => setShowSignUp((prev) => !prev)} className='mt-3 w-full rounded-xl border border-[var(--surface-border)] px-4 py-2 text-sm text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 transition'>
                            {showSignUp ? 'Already have an account? Sign in' : "New here? Create an account"}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen bg-white dark:bg-zinc-950'>
                <Loader2Icon className="size-7 text-blue-500 animate-spin" />
            </div>
        )
    }

    if(user && workspaces.length === 0){
        return (
            <div className='min-h-screen flex justify-center items-center'>
                <CreateOrganization />
            </div>
        )
    }
    return (
        <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col h-screen">
                <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

                <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-scroll">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout