"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { IUser } from '@/models/userModel';
import { IProject } from '@/models/projectModel';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
});

const CreateTaskPage = () => {
    const router = useRouter();
    const params = useParams();
    const { id: projectId } = params;

    const [project, setProject] = useState<IProject | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            name: "",
            description: "",
            assignedTo: "",
        }
    });

    useEffect(() => {
        const fetchProject = async () => {
            const res = await fetch(`/api/projects/${projectId}`);
            if (res.ok) {
                const data = await res.json();
                setProject(data);
            }
        };
        if (projectId) fetchProject();
    }, [projectId]);

    const onSubmit = async (values: z.infer<typeof taskSchema>) => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...values, project: projectId }),
            });
            if (res.ok) {
                router.push(`/projects/${projectId}`);
            } else {
                console.error("Failed to create task");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (!project) return <div>Loading...</div>;

    const userMap = new Map<string, IUser>();
    
    // Add project head
    if (project.projectHead) {
      const head = project.projectHead as unknown as IUser;
      userMap.set(head._id, head);
    }
    
    // Add employees
    if (project.employees) {
      const employees = project.employees as unknown as IUser[];
      employees.forEach(emp => userMap.set(emp._id, emp));
    }

    const projectMembers = Array.from(userMap.values());

    return (
        <div className="container mx-auto p-4 max-w-xl flex flex-col items-center justify-center min-h-[80vh]">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full p-8">
                <div className="flex items-center gap-3 mb-6">
                    <ClipboardDocumentListIcon className="w-8 h-8 text-blue-500" />
                    <h1 className="text-3xl font-extrabold">Create New Task for {project.name}</h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Task Name</FormLabel>
                                    <FormControl><Input placeholder="Enter task name" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl><Textarea placeholder="Enter a description" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="assignedTo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Assign To</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select a user to assign the task" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {projectMembers.map(user => (
                                                <SelectItem key={user._id as string} value={user._id as string}>{user.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow">
                            {isSubmitting ? 'Creating...' : 'Create Task'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CreateTaskPage; 