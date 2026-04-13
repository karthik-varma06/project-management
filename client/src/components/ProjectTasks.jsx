import { format } from "date-fns";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { deleteTask, updateTask } from "../features/workspaceSlice";
import api from "../configs/api";
import { useAuth } from "@clerk/clerk-react";
import {
  PiBugDuotone,
  PiSparkleDuotone,
  PiListChecksDuotone,
  PiTrendUpDuotone,
  PiDotsThreeOutlineVerticalFill,
  PiTrashDuotone,
} from "react-icons/pi";

const typeIcons = {
  BUG: { icon: PiBugDuotone, color: "text-rose-500" },
  FEATURE: { icon: PiSparkleDuotone, color: "text-blue-500" },
  TASK: { icon: PiListChecksDuotone, color: "text-emerald-500" },
  IMPROVEMENT: { icon: PiTrendUpDuotone, color: "text-violet-500" },
  OTHER: { icon: PiDotsThreeOutlineVerticalFill, color: "text-amber-500" },
};

const priorityTexts = {
  LOW: { background: "bg-slate-100 dark:bg-slate-800", prioritycolor: "text-slate-600 dark:text-slate-300" },
  MEDIUM: { background: "bg-blue-100 dark:bg-blue-900/40", prioritycolor: "text-blue-600 dark:text-blue-300" },
  HIGH: { background: "bg-rose-100 dark:bg-rose-900/40", prioritycolor: "text-rose-600 dark:text-rose-300" },
};

const ProjectTasks = ({ tasks }) => {
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedTasks, setSelectedTasks] = useState([]);

  const [filters, setFilters] = useState({
    status: "",
    type: "",
    priority: "",
    assignee: "",
  });

  const assigneeList = useMemo(() => Array.from(new Set(tasks.map((t) => t.assignee?.name).filter(Boolean))), [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const { status, type, priority, assignee } = filters;
      return (
        (!status || task.status === status) &&
        (!type || task.type === type) &&
        (!priority || task.priority === priority) &&
        (!assignee || task.assignee?.name === assignee)
      );
    });
  }, [filters, tasks]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      toast.loading("Updating status...");
      const token = await getToken();
      await api.put(`/api/tasks/${taskId}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });

      const updatedTask = structuredClone(tasks.find((t) => t.id === taskId));
      updatedTask.status = newStatus;
      dispatch(updateTask(updatedTask));

      toast.dismissAll();
      toast.success("Task status updated");
    } catch (error) {
      toast.dismissAll();
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const confirm = window.confirm("Delete selected tasks?");
      if (!confirm) return;
      const token = await getToken();

      toast.loading("Deleting tasks...");
      await api.post(`/api/tasks/delete`, { taskIds: selectedTasks }, { headers: { Authorization: `Bearer ${token}` } });
      dispatch(deleteTask({ projectId: tasks[0]?.projectId, taskIds: selectedTasks }));

      toast.dismissAll();
      toast.success("Tasks deleted");
    } catch (error) {
      toast.dismissAll();
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        {["status", "type", "priority", "assignee"].map((name) => {
          const options = {
            status: [
              { label: "All Statuses", value: "" },
              { label: "To Do", value: "TODO" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Done", value: "DONE" },
            ],
            type: [
              { label: "All Types", value: "" },
              { label: "Task", value: "TASK" },
              { label: "Bug", value: "BUG" },
              { label: "Feature", value: "FEATURE" },
              { label: "Improvement", value: "IMPROVEMENT" },
              { label: "Other", value: "OTHER" },
            ],
            priority: [
              { label: "All Priorities", value: "" },
              { label: "Low", value: "LOW" },
              { label: "Medium", value: "MEDIUM" },
              { label: "High", value: "HIGH" },
            ],
            assignee: [{ label: "All Assignees", value: "" }, ...assigneeList.map((n) => ({ label: n, value: n }))],
          };
          return (
            <select key={name} name={name} onChange={handleFilterChange} className="border border-[var(--surface-border)] outline-none px-3 py-2 rounded-xl text-sm text-[var(--text-main)]">
              {options[name].map((opt, idx) => (
                <option key={idx} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          );
        })}

        {(filters.status || filters.type || filters.priority || filters.assignee) && (
          <button type="button" onClick={() => setFilters({ status: "", type: "", priority: "", assignee: "" })} className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-[var(--text-muted)] text-sm">Reset</button>
        )}

        {selectedTasks.length > 0 && (
          <button type="button" onClick={handleDelete} className="px-3 py-2 flex items-center gap-2 rounded-xl bg-rose-500 text-white text-sm">
            <PiTrashDuotone className="size-4" /> Delete
          </button>
        )}
      </div>

      <div className="overflow-auto rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)]">
        <table className="min-w-full text-sm text-left text-[var(--text-main)]">
          <thead className="text-xs uppercase bg-black/5 dark:bg-white/5 text-[var(--text-muted)]">
            <tr>
              <th className="pl-2 pr-1">
                <input onChange={() => selectedTasks.length === tasks.length ? setSelectedTasks([]) : setSelectedTasks(tasks.map((t) => t.id))} checked={tasks.length > 0 && selectedTasks.length === tasks.length} type="checkbox" className="size-3" />
              </th>
              <th className="px-4 pl-0 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assignee</th>
              <th className="px-4 py-3">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const { icon: Icon, color } = typeIcons[task.type] || {};
                const { background, prioritycolor } = priorityTexts[task.priority] || {};

                return (
                  <tr key={task.id} onClick={() => navigate(`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`)} className="border-t border-[var(--surface-border)] hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer">
                    <td onClick={e => e.stopPropagation()} className="pl-2 pr-1">
                      <input type="checkbox" className="size-3" onChange={() => selectedTasks.includes(task.id) ? setSelectedTasks(selectedTasks.filter((i) => i !== task.id)) : setSelectedTasks((prev) => [...prev, task.id])} checked={selectedTasks.includes(task.id)} />
                    </td>
                    <td className="px-4 pl-0 py-2">{task.title}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className={`size-4 ${color}`} />}
                        <span className={`uppercase text-xs ${color}`}>{task.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`text-xs px-2 py-1 rounded-lg ${background} ${prioritycolor}`}>{task.priority}</span>
                    </td>
                    <td onClick={e => e.stopPropagation()} className="px-4 py-2">
                      <select name="status" onChange={(e) => handleStatusChange(task.id, e.target.value)} value={task.status} className="outline-none px-2 pr-4 py-1 rounded-lg text-sm border border-[var(--surface-border)] cursor-pointer">
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">{task.assignee?.name || "-"}</td>
                    <td className="px-4 py-2">{format(new Date(task.due_date), "dd MMMM")}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-[var(--text-muted)] py-6">No tasks found for the selected filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTasks;
