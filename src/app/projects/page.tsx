"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { IProject } from '@/models/projectModel';
import { Button } from '@/components/ui/button';
import { PlusIcon, StarIcon, UserGroupIcon, ArrowsUpDownIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/input';
import { useSession } from "next-auth/react";

const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
};

const ProjectsPage = () => {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<'name' | 'startDate' | 'endDate' | 'clientName'>('name');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
    const [favorites, setFavorites] = useState<string[]>([]);
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects');
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                }
            } catch (error) {
                console.error('Failed to fetch projects', error);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchProjects();
        }
    }, [status]);

    const filteredProjects = useMemo(() => {
        let filtered = projects.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.clientName.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        );
        if (statusFilter === 'active') filtered = filtered.filter(p => !p.isArchived);
        if (statusFilter === 'archived') filtered = filtered.filter(p => p.isArchived);
        filtered = filtered.sort((a, b) => {
            let aVal = a[sort];
            let bVal = b[sort];
            if (sort === 'name' || sort === 'clientName') {
                aVal = (aVal as string).toLowerCase();
                bVal = (bVal as string).toLowerCase();
            }
            if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
        return filtered;
    }, [projects, search, sort, sortDir, statusFilter]);

    const toggleFavorite = (id: string) => {
        setFavorites(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
    };

    if (loading || status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white pb-16">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 py-8 px-4 rounded-b-2xl shadow mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-4xl font-extrabold text-white drop-shadow">Projects</h1>
                <div className="flex gap-2 items-center">
                    <Link href="/projects/create">
                        <Button className="bg-white/90 hover:bg-white text-blue-700 font-bold shadow flex items-center gap-2">
                            <PlusIcon className="w-5 h-5" /> Create Project
                        </Button>
                    </Link>
                </div>
            </div>
            {/* Controls */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 px-4">
                <Input
                    className="w-full md:w-80 bg-white shadow rounded-xl border border-gray-200"
                    placeholder="Search projects..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className="flex gap-2 items-center flex-wrap">
                    <Button variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')}>All</Button>
                    <Button variant={statusFilter === 'active' ? 'default' : 'outline'} onClick={() => setStatusFilter('active')}>Active</Button>
                    <Button variant={statusFilter === 'archived' ? 'default' : 'outline'} onClick={() => setStatusFilter('archived')}>Archived</Button>
                    <Button variant="outline" className="flex items-center gap-1" onClick={() => { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}>
                        <ArrowsUpDownIcon className="w-4 h-4" />
                        {sort.charAt(0).toUpperCase() + sort.slice(1)}
                    </Button>
                    <select
                        className="ml-2 rounded border-gray-300 text-sm px-2 py-1"
                        value={sort}
                        onChange={e => setSort(e.target.value as any)}
                    >
                        <option value="name">Name</option>
                        <option value="startDate">Start Date</option>
                        <option value="endDate">End Date</option>
                        <option value="clientName">Client</option>
                    </select>
                </div>
            </div>
            {/* Projects Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {filteredProjects.map((project) => (
                    <div key={project._id as string} className="relative group">
                        {/* Favorite Star */}
                        <button
                            className={`absolute top-4 right-4 z-10 rounded-full p-1 bg-white/80 hover:bg-yellow-100 shadow transition ${favorites.includes(project._id as string) ? 'text-yellow-400' : 'text-gray-300'}`}
                            onClick={e => { e.stopPropagation(); e.preventDefault(); toggleFavorite(project._id as string); }}
                            title={favorites.includes(project._id as string) ? 'Unfavorite' : 'Favorite'}
                        >
                            <StarIcon className="w-6 h-6" />
                        </button>
                        <Link href={`/projects/${project._id}`}>
                            <Card className="hover:shadow-2xl transition-shadow duration-200 cursor-pointer rounded-2xl border border-gray-100 bg-white group-hover:-translate-y-1 group-hover:scale-[1.02]">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-t-2xl" />
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-2xl font-bold flex-1">{project.name}</CardTitle>
                                        {/* Status Badge */}
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${project.isArchived ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                                            {project.isArchived ? 'Archived' : 'Active'}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-2 min-h-[40px]">{project.description}</p>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-gray-500"><b>Client:</b> {project.clientName}</span>
                                    </div>
                                    <div className="flex gap-4 text-xs text-gray-500 mb-2">
                                        <span><b>Start:</b> {new Date(project.startDate).toLocaleDateString()}</span>
                                        <span><b>End:</b> {new Date(project.endDate).toLocaleDateString()}</span>
                                    </div>
                                    {/* Team Avatars */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <UserGroupIcon className="w-4 h-4 text-blue-400" />
                                        {/* Project head and up to 2 employees as avatars */}
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-md shadow">
                                            {getInitials((project.projectHead as any)?.name || 'PH')}
                                        </span>
                                        {(Array.isArray(project.employees) && project.employees.slice(0, 2).map((e: any) => (
                                            <span key={e._id as string} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-md shadow -ml-2 border-2 border-white">
                                                {getInitials(e.name || 'E')}
                                            </span>
                                        )))}
                                        {Array.isArray(project.employees) && project.employees.length > 2 && (
                                            <span className="ml-1 text-xs text-gray-400">+{project.employees.length - 2}</span>
                                        )}
                                    </div>
                                    {/* Progress Bar (if tasks available) */}
                                    {Array.isArray(project.tasks) && project.tasks.length > 0 ? (
                                        <div className="mb-2">
                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                                <span>Progress</span>
                                                <span>{Math.round((project.tasks.filter((t: any) => t.status === 'Done').length / project.tasks.length) * 100)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-gradient-to-r from-blue-500 to-indigo-400 h-2 rounded-full" style={{ width: `${Math.round((project.tasks.filter((t: any) => t.status === 'Done').length / project.tasks.length) * 100)}%` }}></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-2 text-xs text-gray-400">No tasks yet</div>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                ))}
                {filteredProjects.length === 0 && (
                    <div className="col-span-full text-center text-gray-400 py-12 text-lg">No projects found.</div>
                )}
            </div>
        </div>
    );
};

export default ProjectsPage; 