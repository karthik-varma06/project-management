import { Link } from "react-router-dom";
import { PiPulseDuotone } from 'react-icons/pi';

const statusColors = {
    PLANNING: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200",
    ACTIVE: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
    ON_HOLD: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    COMPLETED: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    CANCELLED: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
};

const ProjectCard = ({ project }) => {
    return (
        <Link to={`/projectsDetail?id=${project.id}&tab=tasks`} className="border border-[var(--surface-border)] bg-[var(--bg-elevated)] rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/10 group">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text-main)] mb-1 truncate group-hover:text-[var(--brand-a)] transition-colors">{project.name}</h3>
                    <p className="text-[var(--text-muted)] text-sm line-clamp-2 mb-3">{project.description || "No description"}</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 rounded-lg text-xs ${statusColors[project.status]}`}>{project.status.replace("_", " ")}</span>
                <span className="text-xs text-[var(--text-muted)] capitalize">{project.priority} priority</span>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)] flex items-center gap-1"><PiPulseDuotone className='size-3.5' /> Progress</span>
                    <span className="text-[var(--text-main)]">{project.progress || 0}%</span>
                </div>
                <div className="w-full bg-black/5 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-[var(--brand-a)] to-[var(--brand-b)]" style={{ width: `${project.progress || 0}%` }} />
                </div>
            </div>
        </Link>
    );
};

export default ProjectCard;
