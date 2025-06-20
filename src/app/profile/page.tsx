'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { Copy, Loader2, Building2, Mail, Shield, Calendar, Clock, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/navbar';
import { motion } from 'framer-motion';

interface UserProfile {
  email: string;
  role: 'admin' | 'employee' | 'owner';
  companyId: string;
  companyName: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/signup');
    },
  }) as { data: any; status: 'authenticated' | 'loading' | 'unauthenticated' };

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.email) return;
      
      try {
        console.log('Fetching user profile...');
        const response = await fetch('/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        console.log('Profile response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Unauthorized, redirecting to signup...');
            router.push('/signup');
            return;
          }
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        console.log('Profile data received:', data);
        setUserProfile(data);
      } catch (error) {
        console.error('Profile fetch error:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchUserProfile();
    } else if (status === 'unauthenticated') {
      console.log('User is not authenticated, redirecting to signup...');
      router.push('/signup');
    }
  }, [session, status, router]);

  const copyCompanyId = () => {
    if (userProfile?.companyId) {
      navigator.clipboard.writeText(userProfile.companyId);
      toast.success('Company ID copied to clipboard');
    }
  };

  if ((status === 'loading' || status === 'unauthenticated') || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <p className="text-red-500 mb-4">Failed to load profile</p>
            <Button onClick={() => router.push('/signup')}>
              Return to Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-4xl mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-2 pb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center"
              >
                <UserIcon className="h-10 w-10 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail className="h-4 w-4" />
                    <p className="text-sm font-medium">Email</p>
                  </div>
                  <p className="text-lg font-medium">{userProfile.email}</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-gray-500">
                    <Shield className="h-4 w-4" />
                    <p className="text-sm font-medium">Role</p>
                  </div>
                  <Badge variant={userProfile.role === 'admin' ? 'default' : 'secondary'} className="text-sm">
                    {userProfile.role}
                  </Badge>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-gray-500">
                    <Building2 className="h-4 w-4" />
                    <p className="text-sm font-medium">Company Name</p>
                  </div>
                  <p className="text-lg font-medium">{userProfile.companyName}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-gray-500">
                    <Shield className="h-4 w-4" />
                    <p className="text-sm font-medium">Status</p>
                  </div>
                  <Badge variant={userProfile.isActive ? 'success' : 'destructive'} className="text-sm">
                    {userProfile.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </motion.div>

                {(userProfile.role === 'admin' || userProfile.role === 'owner') && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-2 col-span-2"
                  >
                    <div className="flex items-center gap-2 text-gray-500">
                      <Building2 className="h-4 w-4" />
                      <p className="text-sm font-medium">Company ID</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-mono bg-gray-100 p-2 rounded flex-1">{userProfile.companyId}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyCompanyId}
                        className="hover:bg-gray-100"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <p className="text-sm font-medium">Last Login</p>
                  </div>
                  <p className="text-lg">
                    {formatDate(userProfile.lastLogin)}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <p className="text-sm font-medium">Member Since</p>
                  </div>
                  <p className="text-lg">
                    {formatDate(userProfile.createdAt)}
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <footer className="bg-white/80 backdrop-blur-sm border-t mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} FinancePro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ProfilePage;