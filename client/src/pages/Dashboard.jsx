import { Plus } from 'lucide-react'
import { useState } from 'react'
import StatsGrid from '../components/StatsGrid'
import ProjectOverview from '../components/ProjectOverview'
import RecentActivity from '../components/RecentActivity'
import TasksSummary from '../components/TasksSummary'
import CreateProjectDialog from '../components/CreateProjectDialog'
import { useUser } from '@clerk/clerk-react'
import { PiRocketLaunchDuotone } from 'react-icons/pi'

const Dashboard = () => {
    const { user } = useUser()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <div className='max-w-6xl mx-auto space-y-6'>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <p className='inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-gradient-to-r from-[var(--brand-a)]/15 to-[var(--brand-b)]/15 text-[var(--brand-a)] dark:text-blue-300 mb-3'>
                        <PiRocketLaunchDuotone className='size-3.5' /> Productivity cockpit
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text-main)] mb-1">Welcome back, {user?.firstName || 'there'} 👋</h1>
                    <p className="text-[var(--text-muted)] text-sm">Your project pulse across active workspaces, priorities, and deadlines.</p>
                </div>

                <button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl bg-gradient-to-br from-[var(--brand-a)] to-[var(--brand-b)] text-white hover:opacity-90 transition shadow-lg shadow-blue-500/20" >
                    <Plus size={16} /> New Project
                </button>

                <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
            </div>

            <StatsGrid />

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <ProjectOverview />
                    <RecentActivity />
                </div>
                <div>
                    <TasksSummary />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
