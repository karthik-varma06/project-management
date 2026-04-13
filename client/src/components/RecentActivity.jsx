import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { PiBugDuotone, PiSparkleDuotone, PiListChecksDuotone, PiChatCenteredDotsDuotone, PiClockCountdownDuotone, PiGitCommitDuotone } from 'react-icons/pi';

const typeIcons = {
    BUG: { icon: PiBugDuotone, color: "text-rose-500" },
    FEATURE: { icon: PiSparkleDuotone, color: "text-blue-500" },
    TASK: { icon: PiListChecksDuotone, color: "text-emerald-500" },
    IMPROVEMENT: { icon: PiChatCenteredDotsDuotone, color: "text-amber-500" },
    OTHER: { icon: PiGitCommitDuotone, color: "text-violet-500" },
};

const statusColors = {
    TODO: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    IN_PROGRESS: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    DONE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

const RecentActivity = () => {
    const [tasks, setTasks] = useState([]);
    const { currentWorkspace } = useSelector((state) => state.workspace);

    useEffect(() => {
        if (!currentWorkspace) return;
        const flat = currentWorkspace.projects.flatMap((project) => project.tasks.map((task) => task));
        setTasks(flat);
    }, [currentWorkspace]);

    return (
        <div className="border border-[var(--surface-border)] rounded-2xl bg-[var(--bg-elevated)] overflow-hidden">
            <div className="border-b border-[var(--surface-border)] p-4">
                <h2 className="text-lg text-[var(--text-main)] flex items-center gap-2"><PiClockCountdownDuotone className='size-5 text-[var(--brand-a)]' /> Recent Activity</h2>
            </div>

            <div className="p-0">
                {tasks.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center">
                            <PiClockCountdownDuotone className="w-8 h-8 text-[var(--text-muted)]" />
                        </div>
                        <p className="text-[var(--text-muted)]">No recent activity</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--surface-border)]">
                        {tasks.map((task) => {
                            const TypeIcon = typeIcons[task.type]?.icon || PiListChecksDuotone;
                            const iconColor = typeIcons[task.type]?.color || "text-slate-500";

                            return (
                                <div key={task.id} className="p-6 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-black/5 dark:bg-white/10 rounded-xl">
                                            <TypeIcon className={`w-4 h-4 ${iconColor}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="text-[var(--text-main)] truncate">{task.title}</h4>
                                                <span className={`ml-2 px-2 py-1 rounded-lg text-xs ${statusColors[task.status] || "bg-black/5 text-[var(--text-muted)]"}`}>
                                                    {task.status.replace("_", " ")}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                                                <span className="capitalize">{task.type.toLowerCase()}</span>
                                                {task.assignee && (
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-4 h-4 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center text-[10px] text-[var(--text-main)]">
                                                            {task.assignee.name?.[0]?.toUpperCase()}
                                                        </div>
                                                        {task.assignee.name}
                                                    </div>
                                                )}
                                                <span>{format(new Date(task.updatedAt), "MMM d, h:mm a")}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
