import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserPlus } from "lucide-react";
import { HiOutlineMagnifyingGlass, HiOutlineUsers } from "react-icons/hi2";
import { PiPulseDuotone, PiTargetDuotone } from "react-icons/pi";
import InviteMemberDialog from "../components/InviteMemberDialog";
import Avatar from "../components/common/Avatar";

const Team = () => {
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const currentWorkspace = useSelector((state) => state?.workspace?.currentWorkspace || null);
    const projects = currentWorkspace?.projects || [];

    const filteredUsers = users.filter(
        (user) =>
            user?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setUsers(currentWorkspace?.members || []);
        setTasks(currentWorkspace?.projects?.reduce((acc, project) => [...acc, ...project.tasks], []) || []);
    }, [currentWorkspace]);

    return (
        <div className="space-y-6 max-w-6xl mx-auto bento-grid">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text-main)] mb-1">Team</h1>
                    <p className="text-[var(--text-muted)] text-sm">People, roles and contribution metrics in one place.</p>
                </div>
                <button onClick={() => setIsDialogOpen(true)} className="flex items-center px-5 py-2.5 rounded-xl text-sm bg-gradient-to-br from-[var(--brand-a)] to-[var(--brand-b)] hover:opacity-90 text-white transition" >
                    <UserPlus className="w-4 h-4 mr-2" /> Invite Member
                </button>
                <InviteMemberDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Total Members</p>
                            <p className="text-2xl font-semibold text-[var(--text-main)]">{users.length}</p>
                        </div>
                        <HiOutlineUsers className="size-5 text-[var(--brand-a)]" />
                    </div>
                </div>
                <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Active Projects</p>
                            <p className="text-2xl font-semibold text-[var(--text-main)]">{projects.filter((p) => p.status !== "CANCELLED" && p.status !== "COMPLETED").length}</p>
                        </div>
                        <PiPulseDuotone className="size-5 text-emerald-500" />
                    </div>
                </div>
                <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Total Tasks</p>
                            <p className="text-2xl font-semibold text-[var(--text-main)]">{tasks.length}</p>
                        </div>
                        <PiTargetDuotone className="size-5 text-violet-500" />
                    </div>
                </div>
            </div>

            <div className="relative max-w-md">
                <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] size-4" />
                <input placeholder="Search team members..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-full text-sm rounded-xl border border-[var(--surface-border)] bg-transparent text-[var(--text-main)] placeholder-[var(--text-muted)] py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand-a)]/40" />
            </div>

            <div className="w-full">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-16 rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)]">
                        <div className="w-24 h-24 mx-auto mb-6 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center">
                            <HiOutlineUsers className="w-12 h-12 text-[var(--text-muted)]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[var(--text-main)] mb-2">{users.length === 0 ? "No team members yet" : "No members match your search"}</h3>
                        <p className="text-[var(--text-muted)] mb-6">{users.length === 0 ? "Invite team members to start collaborating" : "Try adjusting your search term"}</p>
                    </div>
                ) : (
                    <div className="max-w-4xl w-full">
                        <div className="hidden sm:block overflow-x-auto rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)]">
                            <table className="min-w-full divide-y divide-[var(--surface-border)]">
                                <thead className="bg-black/5 dark:bg-white/5">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-medium text-sm">Name</th>
                                        <th className="px-6 py-3 text-left font-medium text-sm">Email</th>
                                        <th className="px-6 py-3 text-left font-medium text-sm">Role</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--surface-border)]">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-3 whitespace-nowrap flex items-center gap-3">
                                                <Avatar src={user.user.image} name={user.user?.name} email={user.user?.email} className="size-8" />
                                                <span className="text-sm text-[var(--text-main)] truncate">{user.user?.name || "Unknown User"}</span>
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-[var(--text-muted)]">{user.user.email}</td>
                                            <td className="px-6 py-3 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-lg ${user.role === "ADMIN" ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300" : "bg-black/5 dark:bg-white/10 text-[var(--text-muted)]"}`}>
                                                    {user.role || "User"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="sm:hidden space-y-3">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="p-4 border border-[var(--surface-border)] rounded-xl bg-[var(--bg-elevated)]">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Avatar src={user.user.image} name={user.user?.name} email={user.user?.email} className="size-9" />
                                        <div>
                                            <p className="font-medium text-[var(--text-main)]">{user.user?.name || "Unknown User"}</p>
                                            <p className="text-sm text-[var(--text-muted)]">{user.user.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-lg ${user.role === "ADMIN" ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300" : "bg-black/5 dark:bg-white/10 text-[var(--text-muted)]"}`}>
                                        {user.role || "User"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Team;
