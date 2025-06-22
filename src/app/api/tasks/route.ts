import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Project from "@/models/projectModel";
import Task from "@/models/taskModel";
import User from "@/models/userModel";
import dbConnect from "@/dbConfing/dbConfing";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, description, project, assignedTo } = body;

    if (!name || !project) {
        return NextResponse.json({ message: "Missing required fields: name and project are required" }, { status: 400 });
    }

    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
        return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const isProjectHead = projectDoc.projectHead.equals(user._id);

    if (user.role !== 'admin' && user.role !== 'owner' && !isProjectHead) {
        return NextResponse.json({ message: "Forbidden: Only admin, owner, or project head can create tasks" }, { status: 403 });
    }

    const task = new Task({
      name,
      description,
      project,
      assignedTo,
      status: "To Do",
    });

    await task.save();

    projectDoc.tasks.push(task._id);
    await projectDoc.save();

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
} 