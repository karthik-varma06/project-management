import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";
import sendEmail from "../configs/nodemailer.js";

export const inngest = new Inngest({ id: "project-management" });

/* ================= USER SYNC ================= */

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.create({
      data: {
        id: data.id,
        email: data?.email_addresses[0]?.email_address,
        name: data?.first_name + " " + data?.last_name,
        image: data?.image_url,
      },
    });
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.delete({
      where: { id: data.id },
    });
  }
);

const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data?.email_addresses[0]?.email_address,
        name: data?.first_name + " " + data?.last_name,
        image: data?.image_url,
      },
    });
  }
);

/* ================= WORKSPACE SYNC ================= */

const syncWorkspaceCreation = inngest.createFunction(
  { id: "sync-workspace-from-clerk" },
  { event: "clerk/organization.created" },
  async ({ event }) => {
    const { data } = event;

    await prisma.workspace.create({
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        ownerId: data.created_by,
        image_url: data.image_url,
      },
    });

    await prisma.workspaceMember.create({
      data: {
        userId: data.created_by,
        workspaceId: data.id,
        role: "ADMIN",
      },
    });
  }
);

const syncWorkspaceUpdation = inngest.createFunction(
  { id: "update-workspace-from-clerk" },
  { event: "clerk/organization.updated" },
  async ({ event }) => {
    const { data } = event;

    await prisma.workspace.update({
      where: { id: data.id },
      data: {
        name: data.name,
        slug: data.slug,
        image_url: data.image_url,
      },
    });
  }
);

const syncWorkspaceDeletion = inngest.createFunction(
  { id: "delete-workspace-with-clerk" },
  { event: "clerk/organization.deleted" },
  async ({ event }) => {
    const { data } = event;

    await prisma.workspace.delete({
      where: { id: data.id },
    });
  }
);

const syncWorkspaceMemberCreation = inngest.createFunction(
  { id: "sync-workspace-member-from-clerk" },
  { event: "clerk/organizationInvitation.accepted" },
  async ({ event }) => {
    const { data } = event;

    await prisma.workspaceMember.create({
      data: {
        userId: data.user_id,
        workspaceId: data.organization_id,
        role: String(data.role_name).toUpperCase(),
      },
    });
  }
);

/* ================= EMAIL FUNCTION (IMPORTANT) ================= */

const sendTaskAssignmentEmail = inngest.createFunction(
  { id: "send-task-assignment-mail" },
  { event: "app/task.assigned" },
  async ({ event, step }) => {
    const { taskId, origin } = event.data;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: true,
        project: true,
      },
    });

    if (!task) return;

    // SEND EMAIL
    await sendEmail(
      task.assignee.email,
      `New Task Assignment in ${task.project.name}`,
      `
      <h2>Hi ${task.assignee.name} 👋</h2>
      <p>You’ve been assigned a new task:</p>
      <h3>${task.title}</h3>
      <p><strong>Description:</strong> ${task.description}</p>
      <p><strong>Due Date:</strong> ${new Date(task.due_date).toLocaleDateString()}</p>
      <a href="${origin}">View Task</a>
      `
    );

    // WAIT UNTIL DUE DATE
    const dueDate = new Date(task.due_date);

    if (dueDate.toDateString() !== new Date().toDateString()) {
      await step.sleepUntil("wait-for-due-date", dueDate);

      await step.run("check-task-status", async () => {
        const updatedTask = await prisma.task.findUnique({
          where: { id: taskId },
          include: {
            assignee: true,
            project: true,
          },
        });

        if (!updatedTask) return;

        if (updatedTask.status !== "DONE") {
          await sendEmail(
            updatedTask.assignee.email,
            `Reminder: ${updatedTask.project.name}`,
            `<p>Your task "${updatedTask.title}" is still pending.</p>`
          );
        }
      });
    }
  }
);

/* ================= EXPORT ================= */

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  syncWorkspaceCreation,
  syncWorkspaceUpdation,
  syncWorkspaceDeletion,
  syncWorkspaceMemberCreation,
  sendTaskAssignmentEmail 
];