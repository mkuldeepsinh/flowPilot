"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { IProject, IProject as ProjectWithTasks } from '@/models/projectModel';
import { ITask } from '@/models/taskModel';
import { IUser } from '@/models/userModel';
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { CheckCircleIcon, UserGroupIcon, CalendarIcon, CurrencyDollarIcon, ClipboardDocumentListIcon, ArrowTrendingUpIcon, UsersIcon, PlusIcon, ClockIcon } from '@heroicons/react/24/outline';
import React from 'react';

const ProjectDetailsPage = () => {
    const params = useParams();
    const { id } = params;
    const [project, setProject] = useState<ProjectWithTasks | null>(null);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        if (id) {
            const fetchProject = async () => {
                try {
                    const res = await fetch(`/api/projects/${id}`);
                    if (res.ok) {
                        const data = await res.json();
                        setProject(data);
                    }
                } catch (error) {
                    console.error('Failed to fetch project details', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProject();
        }
    }, [id]);

    const handleTaskStatusChange = async (taskId: string, status: string) => {
        try {
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                // Refetch the project to get updated tasks
                const projectRes = await fetch(`/api/projects/${id}`);
                if (projectRes.ok) {
                    const updatedProject = await projectRes.json();
                    setProject(updatedProject);
                }
            }
        } catch (error) {
            console.error('Failed to update task status', error);
        }
    };
    
    const canEditDetails = session?.user?.role === 'admin' || session?.user?.role === 'owner' || project?.projectHead === session?.user.id;
    const canMarkTaskComplete = project?.projectHead === session?.user.id;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!project) {
        return <div>Project not found</div>;
    }

    const tasks = Array.isArray(project.tasks) && typeof project.tasks[0] === 'object' && 'name' in (project.tasks[0] as any)
        ? ((project.tasks as unknown) as ITask[])
        : [];
    const employees = Array.isArray(project.employees) && typeof project.employees[0] === 'object' && 'name' in (project.employees[0] as any)
        ? ((project.employees as unknown) as IUser[])
        : [];
    const progress = getProjectProgress(tasks);
    const timeline = getTaskTimeline(tasks);
    const groupedTasks = groupTasksByStatus(tasks);

    const STATUSES = ['To Do', 'In Progress', 'Done'] as const;
    type StatusType = typeof STATUSES[number];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white pb-16">
            {/* Hero/Header */}
            <div className="relative w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 py-12 px-4 md:px-12 rounded-b-3xl shadow-lg mb-12">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <ArrowTrendingUpIcon className="w-14 h-14 text-white drop-shadow-lg" />
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow">{project.name}</h1>
                            <p className="text-indigo-100 mt-2 max-w-2xl text-lg">{project.description}</p>
                            {/* Project Head Display */}
                            <div className="flex items-center gap-2 mt-3">
                                <span className="font-semibold text-indigo-100">Project Head:</span>
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-md shadow">
                                    {getInitials((project.projectHead as any)?.name || 'PH')}
                                </span>
                                <span className="text-indigo-100 font-medium">{(project.projectHead as any)?.name || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-2">
                        <div className="flex gap-2">
                            {canEditDetails && (
                                <Link href={`/projects/${id}/edit`}>
                                    <Button className="bg-white/90 hover:bg-white text-blue-700 font-bold shadow flex items-center gap-2"><ArrowTrendingUpIcon className="w-5 h-5" />Edit Project</Button>
                                </Link>
                            )}
                            <Link href={`/projects/${id}/tasks/create`}>
                                <Button className="bg-blue-700 hover:bg-blue-800 text-white font-bold shadow flex items-center gap-2"><PlusIcon className="w-5 h-5" />Add Task</Button>
                            </Link>
                        </div>
                        <div className="flex gap-4 mt-2 text-indigo-100 text-sm">
                            <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" />{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><UserGroupIcon className="w-4 h-4" />{employees.length} Team</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 px-4">
                <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border border-gray-100">
                    <div className="flex items-center gap-2 text-blue-600 font-bold"><CalendarIcon className="w-6 h-6" />Project Dates</div>
                    <div className="text-gray-700">{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</div>
                    <div className="text-gray-500 text-sm">Client: <span className="font-semibold text-gray-700">{project.clientName}</span></div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border border-gray-100">
                    <div className="flex items-center gap-2 text-green-600 font-bold"><CurrencyDollarIcon className="w-6 h-6" />Financials</div>
                    <div className="text-gray-700">Revenue: <span className="font-semibold">${project.totalRevenue.toLocaleString()}</span></div>
                    <div className="text-gray-700">Cost: <span className="font-semibold">${project.cost.toLocaleString()}</span></div>
                    <div className="text-gray-700">Profit: <span className="font-semibold">${(project.totalRevenue - project.cost).toLocaleString()}</span></div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border border-gray-100">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold"><ArrowTrendingUpIcon className="w-6 h-6" />Progress</div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-20 h-20">
                            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 40 40">
                                <circle cx="20" cy="20" r="18" fill="none" stroke="#e0e7ef" strokeWidth="4" />
                                <circle cx="20" cy="20" r="18" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="113" strokeDashoffset={`${113 - (progress / 100) * 113}`} strokeLinecap="round" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-indigo-700">{progress}%</span>
                        </div>
                        <span className="text-gray-700">{tasks.length} Tasks</span>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="max-w-6xl mx-auto mb-10 px-4">
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold"><UsersIcon className="w-6 h-6" />Project Team</div>
                    <div className="flex flex-wrap gap-4">
                        {employees.length > 0 ? employees.map(e => (
                            <div key={e._id as string} className="flex flex-col items-center gap-1">
                                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xl shadow">
                                    {getInitials(e.name || 'U')}
                                </span>
                                <span className="text-gray-700 text-sm font-medium">{e.name}</span>
                            </div>
                        )) : <span className="text-gray-400">No employees listed</span>}
                    </div>
                </div>
            </div>

            {/* Kanban Tasks & Timeline */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                {/* Kanban Tasks */}
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-4 text-indigo-700 font-bold text-xl"><ClipboardDocumentListIcon className="w-6 h-6" />Tasks</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {STATUSES.map((status) => (
                            <div key={status} className="bg-white rounded-xl shadow p-4 border border-gray-100 min-h-[200px] flex flex-col">
                                <div className={`font-bold mb-2 flex items-center gap-2 ${status === 'Done' ? 'text-green-600' : status === 'In Progress' ? 'text-yellow-600' : 'text-gray-600'}`}>{status}</div>
                                <div className="flex-1 flex flex-col gap-3">
                                    {groupedTasks[status].length > 0 ? groupedTasks[status].map((task: ITask) => (
                                        <div key={task._id as string} className="bg-indigo-50 rounded-lg p-3 shadow flex flex-col gap-1 border border-indigo-100">
                                            <div className="flex items-center gap-2 font-semibold text-indigo-800">
                                                {task.status === 'Done' ? <CheckCircleIcon className="w-4 h-4 text-green-500" /> : <ClockIcon className="w-4 h-4 text-yellow-500" />}
                                                {task.name}
                                            </div>
                                            <div className="text-gray-600 text-sm">{task.description}</div>
                                            <div className="text-xs text-gray-500">Assigned to: {(task.assignedTo as any)?.name || 'Unassigned'}</div>
                                            {task.completionDate && <div className="text-xs text-green-600">Completed: {new Date(task.completionDate).toLocaleDateString()}</div>}
                                            {(canMarkTaskComplete || session?.user.role === 'admin' || session?.user.role === 'owner') && (
                                                <Select value={task.status} onValueChange={(value) => handleTaskStatusChange(task._id as string, value)}>
                                                    <SelectTrigger className="w-[120px] mt-2">
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="To Do">To Do</SelectItem>
                                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                                        <SelectItem value="Done">Done</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                    )) : <div className="text-gray-300 italic">No tasks</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Timeline */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                        <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold text-xl"><ClockIcon className="w-6 h-6" />Activity Timeline</div>
                        <ol className="relative border-l border-indigo-200">
                            {timeline.length > 0 ? timeline.map((event, idx) => (
                                <li key={idx} className="mb-8 ml-4">
                                    <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-white border-2 border-indigo-200 rounded-full">
                                        {event.icon}
                                    </span>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-semibold text-gray-800">{event.label}</span>
                                        <span className="text-xs text-gray-500">{event.date.toLocaleDateString()} {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </li>
                            )) : <li className="ml-4 text-gray-400">No activity yet</li>}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
};

const getProjectProgress = (tasks: ITask[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'Done').length;
    return Math.round((completed / tasks.length) * 100);
};

const getTaskTimeline = (tasks: ITask[]) => {
    // Flatten events: creation, status changes, completion
    let events: { date: Date, label: string, icon: React.ReactNode, task: ITask }[] = [];
    tasks.forEach(task => {
        events.push({
            date: new Date(task.createdAt),
            label: `Task "${task.name}" created`,
            icon: <ClipboardDocumentListIcon className="w-5 h-5 text-blue-500" />, task
        });
        if (task.status === 'Done' && task.completionDate) {
            events.push({
                date: new Date(task.completionDate),
                label: `Task "${task.name}" completed`,
                icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />, task
            });
        }
        // Optionally, add status change events if you track them
    });
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
};

const groupTasksByStatus = (tasks: ITask[]) => {
    return {
        'To Do': tasks.filter(t => t.status === 'To Do'),
        'In Progress': tasks.filter(t => t.status === 'In Progress'),
        'Done': tasks.filter(t => t.status === 'Done'),
    };
};

export default ProjectDetailsPage; 