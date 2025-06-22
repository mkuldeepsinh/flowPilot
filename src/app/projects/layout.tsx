import React from 'react';
import { Navbar } from '@/components/ui/navbar';

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
} 