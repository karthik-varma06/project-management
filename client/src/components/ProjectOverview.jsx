import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import CreateProjectDialog from "./CreateProjectDialog";
import { PiArrowRightBold, PiFoldersDuotone, PiUsersThreeDuotone, PiCalendarCheckDuotone, PiTargetDuotone } from 'react-icons/pi';

const ProjectOverview = () => {
    const statusColors = {
        PLANNING: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
        ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
        ON_HOLD: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
        COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
        CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
    };

    const currentWorkspace = useSelector((state) => state?.workspace?.currentWorkspace || null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        setProjects(currentWorkspace?.projects || []);
    }, [currentWorkspace]);

    return currentWorkspace && (
        <div className="border border-[var(--surface-border)] bg-[var(--bg-elevated)] rounded-2xl overflow-hidden">
            <div className="border-b border-[var(--surface-border)] p-4 flex items-center justify-between">
                <h2 className="text-md text-[var(--text-main)] flex items-center gap-2"><PiFoldersDuotone className="size-5 text-[var(--brand-a)]" /> Project Overview</h2>
                <Link to={'/projects'} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-2">
                    View all <PiArrowRightBold className="w-3.5 h-3.5" />
                </Link>
            </div>

            <div className="p-0">
                {projects.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-[var(--brand-a)]/20 to-[var(--brand-b)]/10">
                            <PiFoldersDuotone size={32} className="text-[var(--brand-a)]" />
                        </div>
                        <p className="text-[var(--text-muted)]">No projects yet</p>
                        <button onClick={() => setIsDialogOpen(true)} className="mt-4 px-4 py-2 text-sm btn-primary rounded-xl">
                            Create your First Project
                        </button>
                        <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--surface-border)]">
                        {projects.slice(0, 5).map((project) => (
                            <Link key={project.id} to={`/projectsDetail?id=${project.id}&tab=tasks`} className="block p-6 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-[var(--text-main)] mb-1">{project.name}</h3>
                                        <p className="text-sm text-[var(--text-muted)] line-clamp-2">{project.description || 'No description'}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-lg ${statusColors[project.status]}`}>
                                        {project.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mb-3">
                                    <div className="flex items-center gap-1"><PiUsersThreeDuotone className="w-3.5 h-3.5" /> {project.members?.length || 0} members</div>
                                    {project.end_date && (
                                        <div className="flex items-center gap-1"><PiCalendarCheckDuotone className="w-3.5 h-3.5" /> {format(new Date(project.end_date), "MMM d, yyyy")}</div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-[var(--text-muted)] flex items-center gap-1"><PiTargetDuotone className="w-3.5 h-3.5" /> Progress</span>
                                        <span className="text-[var(--text-main)]">{project.progress || 0}%</span>
                                    </div>
                                    <div className="w-full bg-black/5 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                                        <div className="h-1.5 bg-gradient-to-r from-[var(--brand-a)] to-[var(--brand-b)] rounded-full" style={{ width: `${project.progress || 0}%` }} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectOverview;
