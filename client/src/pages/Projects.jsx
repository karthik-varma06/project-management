import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { PiCirclesThreePlusDuotone } from "react-icons/pi";
import ProjectCard from "../components/ProjectCard";
import CreateProjectDialog from "../components/CreateProjectDialog";

export default function Projects() {
    const projects = useSelector((state) => state?.workspace?.currentWorkspace?.projects || []);

    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: "ALL",
        priority: "ALL",
    });

    useEffect(() => {
        let filtered = projects;

        if (searchTerm) {
            filtered = filtered.filter(
                (project) =>
                    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filters.status !== "ALL") {
            filtered = filtered.filter((project) => project.status === filters.status);
        }

        if (filters.priority !== "ALL") {
            filtered = filtered.filter((project) => project.priority === filters.priority);
        }

        setFilteredProjects(filtered);
    }, [projects, searchTerm, filters]);

    return (
        <div className="space-y-6 max-w-6xl mx-auto bento-grid">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text-main)] mb-1">Projects</h1>
                    <p className="text-[var(--text-muted)] text-sm">Manage timelines, priorities and progress at a glance.</p>
                </div>
                <button onClick={() => setIsDialogOpen(true)} className="flex items-center px-5 py-2.5 text-sm rounded-xl bg-gradient-to-br from-[var(--brand-a)] to-[var(--brand-b)] text-white hover:opacity-90 transition" >
                    <Plus className="size-4 mr-2" /> New Project
                </button>
                <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
            </div>

            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative w-full max-w-md">
                    <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                    <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} className="w-full pl-10 text-sm pr-4 py-2.5 rounded-xl border border-[var(--surface-border)] bg-transparent text-[var(--text-main)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-[var(--brand-a)]/40 outline-none" placeholder="Search projects..." />
                </div>
                <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="px-3 py-2.5 rounded-xl border border-[var(--surface-border)] text-[var(--text-main)] text-sm" >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PLANNING">Planning</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
                <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })} className="px-3 py-2.5 rounded-xl border border-[var(--surface-border)] text-[var(--text-main)] text-sm" >
                    <option value="ALL">All Priority</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length === 0 ? (
                    <div className="col-span-full text-center py-16 rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)]">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-br from-[var(--brand-a)]/20 to-[var(--brand-b)]/10">
                            <PiCirclesThreePlusDuotone className="w-12 h-12 text-[var(--brand-a)]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[var(--text-main)] mb-1">No projects found</h3>
                        <p className="text-[var(--text-muted)] mb-6 text-sm">Create your first project to get started</p>
                        <button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-1.5 btn-primary px-4 py-2 rounded-xl mx-auto text-sm" >
                            <Plus className="size-4" />
                            Create Project
                        </button>
                    </div>
                ) : (
                    filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                )}
            </div>
        </div>
    );
}
