import prisma from "../configs/prisma.js";


// =========================
// CREATE PROJECT
// =========================
export const createProject = async (req, res) => {
  try {
    const { userId } = await req.auth();

    const {
      workspaceId,
      description,
      name,
      status,
      start_date,
      end_date,
      team_members,
      team_lead,
      progress,
      priority,
    } = req.body;

    // Check if workspace exists + user is ADMIN
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isAdmin = workspace.members.some(
      (m) => m.userId === userId && m.role === "ADMIN"
    );

    if (!isAdmin) {
      return res.status(403).json({
        message: "You don't have permission to create projects",
      });
    }

    // Get team lead
    const teamLead = await prisma.user.findUnique({
      where: { email: team_lead },
      select: { id: true },
    });

    // Create project
    const project = await prisma.project.create({
      data: {
        workspaceId,
        name,
        description,
        status,
        priority,
        progress,
        team_lead: teamLead?.id,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
      },
    });

    // Add members
    if (team_members?.length > 0) {
      const membersToAdd = [];

      workspace.members.forEach((member) => {
        if (team_members.includes(member.userId)) {
          membersToAdd.push(member.userId);
        }
      });

      await prisma.projectMember.createMany({
        data: membersToAdd.map((userId) => ({
          projectId: project.id,
          userId,
        })),
      });
    }

    // Return full project
    const projectWithMembers = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        members: { include: { user: true } },
        tasks: {
          include: {
            assignee: true,
            comments: { include: { user: true } },
          },
        },
        owner: true,
      },
    });

    res.json({
      project: projectWithMembers,
      message: "Project created successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// =========================
// UPDATE PROJECT
// =========================
export const updateProject = async (req, res) => {
  try {
    const { userId } = await req.auth();

    const {
      id,
      workspaceId,
      description,
      name,
      status,
      start_date,
      end_date,
      progress,
      priority,
    } = req.body;

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isAdmin = workspace.members.some(
      (m) => m.userId === userId && m.role === "ADMIN"
    );

    if (!isAdmin) {
      return res.status(403).json({
        message: "You don't have permission to update projects",
      });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        status,
        priority,
        progress,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
      },
    });

    res.json({
      project,
      message: "Project updated successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// =========================
// ADD MEMBER TO PROJECT
// =========================
export const addMember = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { projectId } = req.params;
    const { email } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: { include: { user: true } } },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only team lead can add members
    if (project.team_lead !== userId) {
      return res.status(403).json({
        message: "Only project lead can add members",
      });
    }

    // Check already exists
    const existingMember = project.members.find(
      (m) => m.user.email === email
    );

    if (existingMember) {
      return res.status(400).json({
        message: "User is already a member",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const member = await prisma.projectMember.create({
      data: {
        userId: user.id,
        projectId,
      },
    });

    res.json({
      member,
      message: "Member added successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};