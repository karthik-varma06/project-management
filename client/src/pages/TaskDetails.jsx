import { format } from "date-fns";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth,useUser } from "@clerk/clerk-react";
import api from "../configs/api";
import Avatar from "../components/common/Avatar";
import { PiCalendarCheckDuotone, PiChatCenteredDotsDuotone, PiNotePencilDuotone } from 'react-icons/pi';

const TaskDetails = () => {
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get("projectId");
    const taskId = searchParams.get("taskId");

    const { user } = useUser();
    const { getToken } = useAuth();

    const [task, setTask] = useState(null);
    const [project, setProject] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);

    const { currentWorkspace } = useSelector((state) => state.workspace);

    const fetchComments = async () => {
        if(!taskId) return
        try {
            const token = await getToken()
            const { data } = await api.get(`/api/comments/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
            setComments(data.comments || []);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const fetchTaskDetails = async () => {
        setLoading(true);

        if (!projectId || !taskId || !currentWorkspace?.projects) {
            setTask(null);
            setProject(null);
            setLoading(false);
            return;
        }

        const proj = currentWorkspace.projects.find((p) => p.id === projectId);
        if (!proj) {
            setTask(null);
            setProject(null);
            setLoading(false);
            return;
        }

        const tsk = proj.tasks.find((t) => t.id === taskId);
        if (!tsk) {
            setTask(null);
            setProject(proj);
            setLoading(false);
            return;
        }

        setTask(tsk);
        setProject(proj);
        setLoading(false);
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            toast.loading("Adding comment...");
            const token = await getToken()
            const { data } = await api.post('/api/comments', {taskId : task.id, content: newComment}, { headers: { Authorization: `Bearer ${token}` } });
            setComments((prev) => [...prev, data.comment]);
            setNewComment("");
            toast.dismissAll();
            toast.success("Comment added.");
        } catch (error) {
            toast.dismissAll();
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    useEffect(() => { fetchTaskDetails(); }, [taskId, projectId, currentWorkspace]);

    useEffect(() => {
        if (taskId && task) {
            fetchComments();
            const interval = setInterval(() => { fetchComments(); }, 10000);
            return () => clearInterval(interval);
        }
    }, [taskId, task]);

    if (loading) return <div className="text-[var(--text-muted)] px-4 py-6">Loading task details...</div>;
    if (!task) return <div className="text-rose-500 px-4 py-6">Task not found.</div>;

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-6 sm:p-4 text-[var(--text-main)] max-w-6xl mx-auto">
            <div className="w-full lg:w-2/3">
                <div className="p-5 rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] flex flex-col lg:h-[80vh]">
                    <h2 className="text-base font-semibold flex items-center gap-2 mb-4 text-[var(--text-main)]">
                        <PiChatCenteredDotsDuotone className="size-5 text-[var(--brand-a)]" /> Task Discussion ({comments.length})
                    </h2>

                    <div className="flex-1 md:overflow-y-scroll no-scrollbar">
                        {comments.length > 0 ? (
                            <div className="flex flex-col gap-4 mb-6 mr-2">
                                {comments.map((comment) => (
                                    <div key={comment.id} className={`sm:max-w-4/5 border border-[var(--surface-border)] p-3 rounded-xl bg-black/5 dark:bg-white/5 ${comment.user.id === user?.id ? "ml-auto" : "mr-auto"}`} >
                                        <div className="flex items-center gap-2 mb-1 text-sm text-[var(--text-muted)]">
                                            <Avatar src={comment.user.image} name={comment.user.name} email={comment.user.email} className="size-6" textClassName="text-[10px]" />
                                            <span className="font-medium text-[var(--text-main)]">{comment.user.name}</span>
                                            <span className="text-xs text-[var(--text-muted)]">• {format(new Date(comment.createdAt), "dd MMM yyyy, HH:mm")}</span>
                                        </div>
                                        <p className="text-sm text-[var(--text-main)]">{comment.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[var(--text-muted)] mb-4 text-sm">No comments yet. Be the first!</p>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full border border-[var(--surface-border)] rounded-xl p-3 text-sm bg-transparent text-[var(--text-main)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-a)]/40"
                            rows={3}
                        />
                        <button onClick={handleAddComment} className="bg-gradient-to-l from-[var(--brand-a)] to-[var(--brand-b)] transition text-white text-sm px-5 py-2 rounded-xl">Post</button>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--surface-border)]">
                    <div className="mb-3">
                        <h1 className="text-lg font-medium text-[var(--text-main)]">{task.title}</h1>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 text-[var(--text-main)] text-xs">{task.status}</span>
                            <span className="px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs">{task.type}</span>
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs">{task.priority}</span>
                        </div>
                    </div>

                    {task.description && <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{task.description}</p>}

                    <hr className="border-[var(--surface-border)] my-3" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[var(--text-main)]">
                        <div className="flex items-center gap-2">
                            <Avatar src={task.assignee?.image} name={task.assignee?.name} email={task.assignee?.email} className="size-6" textClassName="text-[10px]" />
                            {task.assignee?.name || "Unassigned"}
                        </div>
                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                            <PiCalendarCheckDuotone className="size-4" /> Due : {format(new Date(task.due_date), "dd MMM yyyy")}
                        </div>
                    </div>
                </div>

                {project && (
                    <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] text-[var(--text-main)] border border-[var(--surface-border)]">
                        <p className="text-lg font-medium mb-4">Project Details</p>
                        <h2 className="flex items-center gap-2"> <PiNotePencilDuotone className="size-4 text-[var(--brand-a)]" /> {project.name}</h2>
                        <p className="text-xs mt-3 text-[var(--text-muted)]">Project Start Date: {format(new Date(project.start_date), "dd MMM yyyy")}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)] mt-3">
                            <span>Status: {project.status}</span>
                            <span>Priority: {project.priority}</span>
                            <span>Progress: {project.progress}%</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetails;
