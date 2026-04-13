import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PiArrowLeftBold, PiPlusBold, PiGearDuotone, PiChartDonutDuotone, PiCalendarDotsDuotone, PiListChecksDuotone, PiLightningDuotone } from "react-icons/pi";
import ProjectAnalytics from "../components/ProjectAnalytics";
import ProjectSettings from "../components/ProjectSettings";
import CreateTaskDialog from "../components/CreateTaskDialog";
import ProjectCalendar from "../components/ProjectCalendar";
import ProjectTasks from "../components/ProjectTasks";

export default function ProjectDetail() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab');
    const id = searchParams.get('id');

    const navigate = useNavigate();
    const projects = useSelector((state) => state?.workspace?.currentWorkspace?.projects || []);

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [activeTab, setActiveTab] = useState(tab || "tasks");

    useEffect(() => {
        if (tab) setActiveTab(tab);
    }, [tab]);

    useEffect(() => {
        if (projects && projects.length > 0) {
            const proj = projects.find((p) => p.id === id);
            setProject(proj);
            setTasks(proj?.tasks || []);
        }
    }, [id, projects]);

    const statusColors = {
        PLANNING: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
        ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
        ON_HOLD: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
        COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
        CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    };

    if (!project) {
        return (
            <div className="p-6 text-center text-[var(--text-main)]">
                <p className="text-3xl md:text-5xl mt-40 mb-10">Project not found</p>
                <button onClick={() => navigate('/projects')} className="mt-4 px-4 py-2 rounded-xl border border-[var(--surface-border)] text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5" >
                    Back to Projects
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-5 max-w-6xl mx-auto text-[var(--text-main)]">
            <div className="flex max-md:flex-col gap-4 flex-wrap items-start justify-between max-w-6xl">
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-muted)]" onClick={() => navigate('/projects')}>
                        <PiArrowLeftBold className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-semibold">{project.name}</h1>
                        <span className={`px-2 py-1 rounded-lg text-xs capitalize ${statusColors[project.status]}`}>{project.status.replace("_", " ")}</span>
                    </div>
                </div>
                <button onClick={() => setShowCreateTask(true)} className="flex items-center gap-2 px-5 py-2 text-sm rounded-xl bg-gradient-to-br from-[var(--brand-a)] to-[var(--brand-b)] text-white" >
                    <PiPlusBold className="size-4" /> New Task
                </button>
            </div>

            <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
                {[
                    { label: "Total Tasks", value: tasks.length, color: "text-slate-600" },
                    { label: "Completed", value: tasks.filter((t) => t.status === "DONE").length, color: "text-emerald-500" },
                    { label: "In Progress", value: tasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "TODO").length, color: "text-amber-500" },
                    { label: "Team Members", value: project.members?.length || 0, color: "text-blue-500" },
                ].map((card, idx) => (
                    <div key={idx} className="border border-[var(--surface-border)] bg-[var(--bg-elevated)] flex justify-between sm:min-w-60 p-4 rounded-2xl">
                        <div>
                            <div className="text-xs text-[var(--text-muted)]">{card.label}</div>
                            <div className={`text-2xl font-semibold ${card.color}`}>{card.value}</div>
                        </div>
                        <PiLightningDuotone className={`size-4 ${card.color}`} />
                    </div>
                ))}
            </div>

            <div>
                <div className="inline-flex flex-wrap max-sm:grid grid-cols-2 gap-2 border border-[var(--surface-border)] rounded-2xl p-1 bg-[var(--bg-elevated)]">
                    {[
                        { key: "tasks", label: "Tasks", icon: PiListChecksDuotone },
                        { key: "calendar", label: "Calendar", icon: PiCalendarDotsDuotone },
                        { key: "analytics", label: "Analytics", icon: PiChartDonutDuotone },
                        { key: "settings", label: "Settings", icon: PiGearDuotone },
                    ].map((tabItem) => (
                        <button key={tabItem.key} onClick={() => { setActiveTab(tabItem.key); setSearchParams({ id: id, tab: tabItem.key }) }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${activeTab === tabItem.key ? "bg-gradient-to-r from-[var(--brand-a)]/20 to-[var(--brand-b)]/20" : "hover:bg-black/5 dark:hover:bg-white/5"}`} >
                            <tabItem.icon className="size-3.5" />
                            {tabItem.label}
                        </button>
                    ))}
                </div>

                <div className="mt-6">
                    {activeTab === "tasks" && <div className="rounded-2xl"><ProjectTasks tasks={tasks} /></div>}
                    {activeTab === "analytics" && <div className="rounded-2xl"><ProjectAnalytics tasks={tasks} project={project} /></div>}
                    {activeTab === "calendar" && <div className="rounded-2xl"><ProjectCalendar tasks={tasks} /></div>}
                    {activeTab === "settings" && <div className="rounded-2xl"><ProjectSettings project={project} /></div>}
                </div>
            </div>

            {showCreateTask && <CreateTaskDialog showCreateTask={showCreateTask} setShowCreateTask={setShowCreateTask} projectId={id} />}
        </div>
    );
}
