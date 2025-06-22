import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import Task from "@/models/taskModel";
import dbConnect from "@/dbConfing/dbConfing";

export async function GET(request: Request, context: { params: { id: string } }) {
    await dbConnect();
    try {
        const { params } = context;
        const awaitedParams = await params;
        const { id } = awaitedParams;
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const project = await Project.findById(id)
            .populate("projectHead", "name email")
            .populate("employees", "name email")
            .populate({
                path: "tasks",
                populate: { path: "assignedTo", select: "name email" }
            });
        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const isEmployeeInProject = project.employees?.some((employee: any) => employee._id.equals(user._id));
        const isProjectHead = project.projectHead?._id.equals(user._id);

        if (user.role !== 'admin' && user.role !== 'owner' && !isEmployeeInProject && !isProjectHead) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(project, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: { id: string } }) {
    await dbConnect();
    try {
        const { params } = context;
        const awaitedParams = await params;
        const { id } = awaitedParams;
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const project = await Project.findById(id);
        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        const isProjectHead = project.projectHead.equals(user._id);

        if (user.role !== 'admin' && user.role !== 'owner' && !isProjectHead) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        
        // Fields editable by project head, admin, or owner
        const { name, description, startDate, endDate, clientName, employees } = body;
        const updateData: any = { name, description, startDate, endDate, clientName, employees };
        
        // Fields editable only by admin or owner
        if (user.role === 'admin' || user.role === 'owner') {
            if (body.totalRevenue !== undefined) updateData.totalRevenue = body.totalRevenue;
            if (body.cost !== undefined) updateData.cost = body.cost;
            if (body.projectHead !== undefined) updateData.projectHead = body.projectHead;
        }

        const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });

        return NextResponse.json(updatedProject, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
    await dbConnect();
    try {
        const { params } = context;
        const awaitedParams = await params;
        const { id } = awaitedParams;
        const session = await getServerSession(authOptions);
        if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'owner')) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const project = await Project.findByIdAndUpdate(id, { isArchived: true }, { new: true });
        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Project archived successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
} 