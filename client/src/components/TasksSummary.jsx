import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { PiArrowRightBold, PiUserCircleDuotone, PiWarningCircleDuotone, PiTimerDuotone } from 'react-icons/pi';

export default function TasksSummary() {
    const { currentWorkspace } = useSelector((state) => state.workspace);
    const { user } = useUser();
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (currentWorkspace) {
            setTasks(currentWorkspace.projects.flatMap((project) => project.tasks));
        }
    }, [currentWorkspace]);

    const myTasks = tasks.filter(i => i.assigneeId === user?.id);
    const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'DONE');
    const inProgressIssues = tasks.filter(i => i.status === 'IN_PROGRESS');

    const summaryCards = [
        {
            title: 'My Tasks',
            count: myTasks.length,
            icon: PiUserCircleDuotone,
            color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
            items: myTasks.slice(0, 3),
        },
        {
            title: 'Overdue',
            count: overdueTasks.length,
            icon: PiWarningCircleDuotone,
            color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
            items: overdueTasks.slice(0, 3),
        },
        {
            title: 'In Progress',
            count: inProgressIssues.length,
            icon: PiTimerDuotone,
            color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
            items: inProgressIssues.slice(0, 3),
        },
    ];

    return (
        <div className="space-y-5">
            {summaryCards.map((card) => (
                <div key={card.title} className="border border-[var(--surface-border)] bg-[var(--bg-elevated)] rounded-2xl overflow-hidden">
                    <div className="border-b border-[var(--surface-border)] p-4 pb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-black/5 dark:bg-white/5 rounded-xl">
                                <card.icon className="w-4 h-4 text-[var(--brand-a)]" />
                            </div>
                            <div className="flex items-center justify-between flex-1">
                                <h3 className="text-sm font-medium text-[var(--text-main)]">{card.title}</h3>
                                <span className={`inline-block mt-1 px-2 py-1 rounded-lg text-xs font-semibold ${card.color}`}>
                                    {card.count}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        {card.items.length === 0 ? (
                            <p className="text-sm text-[var(--text-muted)] text-center py-4">No {card.title.toLowerCase()}</p>
                        ) : (
                            <div className="space-y-3">
                                {card.items.map((issue) => (
                                    <div key={issue.id} className="p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer">
                                        <h4 className="text-sm font-medium text-[var(--text-main)] truncate">{issue.title}</h4>
                                        <p className="text-xs text-[var(--text-muted)] capitalize mt-1">{issue.type} • {issue.priority} priority</p>
                                    </div>
                                ))}
                                {card.count > 3 && (
                                    <button className="flex items-center justify-center w-full text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] mt-2">
                                        View {card.count - 3} more <PiArrowRightBold className="w-3 h-3 ml-2" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
