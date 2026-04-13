import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace } from "../features/workspaceSlice";
import { useNavigate } from "react-router-dom";
import { useClerk, useOrganizationList } from "@clerk/clerk-react";
import Avatar from "./common/Avatar";

function WorkspaceDropdown() {
    const { setActive, userMemberships, isLoaded } = useOrganizationList({
        userMemberships: true,
    });

    const { openCreateOrganization } = useClerk()

    const { workspaces } = useSelector((state) => state.workspace);
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSelectWorkspace = (organizationId) => {
        setActive({ organization: organizationId })
        dispatch(setCurrentWorkspace(organizationId))
        setIsOpen(false);
        navigate('/')
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (currentWorkspace && isLoaded) {
            setActive({ organization: currentWorkspace.id })
        }
    }, [currentWorkspace, isLoaded])


    return (
        <div className="relative m-4" ref={dropdownRef}>
            <button onClick={() => setIsOpen(prev => !prev)} className="w-full flex items-center justify-between p-3 h-auto text-left rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] hover:bg-black/5 dark:hover:bg-white/5 transition" >
                <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                        src={currentWorkspace?.image_url}
                        name={currentWorkspace?.name}
                        seed={currentWorkspace?.id}
                        className="w-9 h-9"
                        textClassName="text-xs"
                        alt={currentWorkspace?.name || "Workspace"}
                    />
                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-[var(--text-main)] text-sm truncate">
                            {currentWorkspace?.name || "Select Workspace"}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] truncate">
                            {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
                <ChevronDown className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-72 bg-[var(--bg-elevated)] border border-[var(--surface-border)] rounded-2xl shadow-xl top-[calc(100%+0.5rem)] left-0 p-2">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1 px-2">
                        Workspaces
                    </p>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                        {(userMemberships?.data || []).map(({ organization }) => (
                            <div key={organization.id} onClick={() => onSelectWorkspace(organization.id)} className="flex items-center gap-3 p-2 cursor-pointer rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition" >
                                <Avatar
                                    src={organization.imageUrl}
                                    name={organization.name}
                                    seed={organization.id}
                                    className="w-7 h-7"
                                    textClassName="text-[10px]"
                                    alt={organization.name}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[var(--text-main)] truncate">
                                        {organization.name}
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)] truncate">
                                        {organization.membersCount || 0} members
                                    </p>
                                </div>
                                {currentWorkspace?.id === organization.id && (
                                    <Check className="w-4 h-4 text-[var(--brand-a)] flex-shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>

                    <button onClick={() => { openCreateOrganization(); setIsOpen(false) }} className="mt-2 w-full p-2 rounded-xl border border-dashed border-[var(--surface-border)] text-xs text-[var(--brand-a)] hover:bg-[var(--brand-a)]/10 transition flex items-center justify-center gap-1.5" >
                        <Plus className="w-4 h-4" /> Create Workspace
                    </button>
                </div>
            )}
        </div>
    );
}

export default WorkspaceDropdown;
