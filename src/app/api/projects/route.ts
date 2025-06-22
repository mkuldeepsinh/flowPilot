import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import dbConnect from "@/dbConfing/dbConfing";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user.role !== "admin" && session.user.role !== "owner")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, startDate, endDate, clientName, projectHead, employees, totalRevenue, cost } = body;

    if (!name || !description || !startDate || !endDate || !clientName || !projectHead) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const project = new Project({
      name,
      description,
      startDate,
      endDate,
      clientName,
      projectHead,
      employees: employees || [],
      totalRevenue,
      cost
    });

    await project.save();

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
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

        let projects;
        if (user.role === "admin" || user.role === "owner") {
            projects = await Project.find().populate("projectHead", "name email").populate("employees", "name email");
        } else {
            projects = await Project.find({
                $or: [{ projectHead: user._id }, { employees: user._id }],
            }).populate("projectHead", "name email").populate("employees", "name email");
        }

        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
} 