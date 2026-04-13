import { Orbit, CheckCheck, Hourglass, AlertOctagon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function StatsGrid() {
    const currentWorkspace = useSelector((state) => state?.workspace?.currentWorkspace || null);

    const [stats, setStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        myTasks: 0,
        overdueIssues: 0,
    });

    const statCards = [
        {
            icon: Orbit,
            title: 'Total Projects',
            value: stats.totalProjects,
            subtitle: `inside ${currentWorkspace?.name || 'workspace'}`,
            textColor: 'text-indigo-500',
            glow: 'from-indigo-500/20 to-violet-500/5',
        },
        {
            icon: CheckCheck,
            title: 'Completed Tasks',
            value: stats.completedProjects,
            subtitle: 'finished across projects',
            textColor: 'text-emerald-500',
            glow: 'from-emerald-500/20 to-teal-500/5',
        },
        {
            icon: Hourglass,
            title: 'My Tasks',
            value: stats.myTasks,
            subtitle: 'currently assigned',
            textColor: 'text-blue-500',
            glow: 'from-blue-500/20 to-cyan-500/5',
        },
        {
            icon: AlertOctagon,
            title: 'Overdue',
            value: stats.overdueIssues,
            subtitle: 'needs action now',
            textColor: 'text-rose-500',
            glow: 'from-rose-500/20 to-orange-500/5',
        },
    ];

    useEffect(() => {
        if (currentWorkspace) {
            setStats({
                totalProjects: currentWorkspace.projects.length,
                activeProjects: currentWorkspace.projects.filter((p) => p.status !== 'CANCELLED' && p.status !== 'COMPLETED').length,
                completedProjects: currentWorkspace.projects.filter((p) => p.status === 'COMPLETED').reduce((acc, project) => acc + project.tasks.length, 0),
                myTasks: currentWorkspace.projects.reduce(
                    (acc, project) => acc + project.tasks.filter((t) => t.assignee?.email === currentWorkspace.owner.email).length,
                    0
                ),
                overdueIssues: currentWorkspace.projects.reduce(
                    (acc, project) => acc + project.tasks.filter((t) => t.due_date < new Date()).length,
                    0
                ),
            });
        }
    }, [currentWorkspace]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-2">
            {statCards.map(({ icon, title, value, subtitle, textColor, glow }, i) => {
                const StatIcon = icon;
                return (
                <div key={i} className="relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] p-5">
                    <div className={`absolute inset-0 bg-gradient-to-br ${glow} pointer-events-none`} />
                    <div className="relative flex items-start justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">{title}</p>
                            <p className="text-3xl font-semibold mt-1 text-[var(--text-main)]">{value}</p>
                            {subtitle && <p className="text-xs text-[var(--text-muted)] mt-2">{subtitle}</p>}
                        </div>
                        <div className="p-2 rounded-xl bg-white/60 dark:bg-white/5 border border-[var(--surface-border)]">
                            <StatIcon size={18} className={textColor} />
                        </div>
                    </div>
                </div>
            )})}
        </div>
    );
}
