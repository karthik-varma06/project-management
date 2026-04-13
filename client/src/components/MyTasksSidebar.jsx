import { useEffect, useState } from 'react';
import { PiListChecksBold } from 'react-icons/pi';
import { HiChevronDown, HiChevronRight } from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

function MyTasksSidebar() {
    const { user } = useUser();
    const { currentWorkspace } = useSelector((state) => state.workspace);

    const [showMyTasks, setShowMyTasks] = useState(false);
    const [myTasks, setMyTasks] = useState([]);

    const toggleMyTasks = () => setShowMyTasks(prev => !prev);

    const getTaskStatusColor = (status) => {
        switch (status) {
            case 'DONE':
                return 'bg-emerald-500';
            case 'IN_PROGRESS':
                return 'bg-amber-500';
            case 'TODO':
                return 'bg-slate-400';
            default:
                return 'bg-slate-300';
        }
    };

    useEffect(() => {
        const userId = user?.id || '';
        if (!userId || !currentWorkspace) return;

        const currentWorkspaceTasks = currentWorkspace.projects.flatMap((project) =>
            project.tasks.filter((task) => task?.assignee?.id === userId)
        );

        setMyTasks(currentWorkspaceTasks);
    }, [currentWorkspace, user?.id]);

    return (
        <div className="mt-5">
            <div onClick={toggleMyTasks} className="flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5">
                <div className="flex items-center gap-2">
                    <PiListChecksBold className="w-4 h-4 text-[var(--text-muted)]" />
                    <h3 className="text-sm font-medium text-[var(--text-main)]">My Tasks</h3>
                    <span className="bg-black/5 dark:bg-white/10 text-[var(--text-muted)] text-xs px-2 py-0.5 rounded-lg">
                        {myTasks.length}
                    </span>
                </div>

                {showMyTasks ? (
                    <HiChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                ) : (
                    <HiChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                )}
            </div>

            {showMyTasks && (
                <div className="mt-2 pl-2 space-y-1">
                    {myTasks.length === 0 ? (
                        <div className="px-3 py-2 text-xs text-[var(--text-muted)] text-center">
                            No tasks assigned
                        </div>
                    ) : (
                        myTasks.map((task) => (
                            <Link
                                key={task.id}
                                to={`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`}
                                className="w-full rounded-xl transition-all duration-200 text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
                            >
                                <div className="flex items-center gap-2 px-3 py-2 w-full min-w-0">
                                    <div className={`w-2 h-2 rounded-full ${getTaskStatusColor(task.status)} flex-shrink-0`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">{task.title}</p>
                                        <p className="text-[11px] text-[var(--text-muted)] lowercase">
                                            {task.status.replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default MyTasksSidebar;
