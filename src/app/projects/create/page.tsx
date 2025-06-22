"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select'; // Assuming a multi-select component exists
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { IUser } from '@/models/userModel';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  clientName: z.string().min(1, "Client name is required"),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  projectHead: z.string().min(1, "Project head is required"),
  employees: z.array(z.string()).min(1, "At least one employee must be selected"),
});

const CreateProjectPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<IUser[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
        name: "",
        description: "",
        clientName: "",
        startDate: "",
        endDate: "",
        projectHead: "",
        employees: [],
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    };
    fetchUsers();
  }, []);

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        router.push('/projects');
      } else {
        // Handle error
        console.error("Failed to create project");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-xl flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full p-8">
        <div className="flex items-center gap-3 mb-6">
          <ClipboardDocumentListIcon className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-extrabold">Create New Project</h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl><Input placeholder="Enter project name" {...field} /></FormControl>
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
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl><Input placeholder="Enter client name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
                control={form.control}
                name="projectHead"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Project Head</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a project head" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {users.map(user => (
                                    <SelectItem key={user._id as string} value={user._id as string}>{user.name || "Unnamed"}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="employees"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Employees</FormLabel>
                        <MultiSelect
                            options={users.map(u => ({ value: u._id as string, label: u.name || "Unnamed" }))}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            placeholder="Select employees"
                        />
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow">
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateProjectPage; 