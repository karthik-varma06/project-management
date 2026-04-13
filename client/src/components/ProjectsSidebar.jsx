import { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiChevronRight } from 'react-icons/hi2';
import { PiKanbanDuotone, PiChartDonutDuotone, PiCalendarDotsDuotone, PiSlidersHorizontalDuotone, PiArrowRightBold } from 'react-icons/pi';

const ProjectSidebar = () => {
    const location = useLocation();
    const [expandedProjects, setExpandedProjects] = useState(new Set());
    const [searchParams] = useSearchParams();

    const projects = useSelector((state) => state?.workspace?.currentWorkspace?.projects || []);

    const getProjectSubItems = (projectId) => [
        { title: 'Tasks', icon: PiKanbanDuotone, url: `/projectsDetail?id=${projectId}&tab=tasks` },
        { title: 'Analytics', icon: PiChartDonutDuotone, url: `/projectsDetail?id=${projectId}&tab=analytics` },
        { title: 'Calendar', icon: PiCalendarDotsDuotone, url: `/projectsDetail?id=${projectId}&tab=calendar` },
        { title: 'Settings', icon: PiSlidersHorizontalDuotone, url: `/projectsDetail?id=${projectId}&tab=settings` },
    ];

    const toggleProject = (id) => {
        const newSet = new Set(expandedProjects);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        setExpandedProjects(newSet);
    };

    return (
        <div className="mt-5 px-1">
            <div className="flex items-center justify-between px-2 py-2">
                <h3 className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Projects</h3>
                <Link to="/projects">
                    <button className="size-6 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 rounded-lg flex items-center justify-center transition-colors duration-200">
                        <PiArrowRightBold className="size-3.5" />
                    </button>
                </Link>
            </div>

            <div className="space-y-1">
                {projects.map((project) => (
                    <div key={project.id}>
                        <button
                            onClick={() => toggleProject(project.id)}
                            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl transition-colors duration-200 text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
                        >
                            <HiChevronRight className={`size-3.5 text-[var(--text-muted)] transition-transform duration-200 ${expandedProjects.has(project.id) && 'rotate-90'}`} />
                            <div className="size-2 rounded-full bg-gradient-to-r from-[var(--brand-a)] to-[var(--brand-b)]" />
                            <span className="truncate max-w-40 text-sm">{project.name}</span>
                        </button>

                        {expandedProjects.has(project.id) && (
                            <div className="ml-5 mt-1 space-y-1">
                                {getProjectSubItems(project.id).map((subItem) => {
                                    const isActive =
                                        location.pathname === `/projectsDetail` &&
                                        searchParams.get('id') === project.id &&
                                        searchParams.get('tab') === subItem.title.toLowerCase();

                                    return (
                                        <Link
                                            key={subItem.title}
                                            to={subItem.url}
                                            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-colors duration-200 text-xs ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-[var(--brand-a)]/20 to-[var(--brand-b)]/20 text-[var(--brand-a)] dark:text-blue-300'
                                                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'
                                            }`}
                                        >
                                            <subItem.icon className="size-3.5" />
                                            {subItem.title}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectSidebar;
