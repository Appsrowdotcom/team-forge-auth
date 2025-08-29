import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Users, FolderOpen, BarChart3, Plus } from 'lucide-react';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { ProjectList } from '@/components/projects/ProjectList';
import { ProjectComments } from '@/components/projects/ProjectComments';

const AdminDashboard: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [showComments, setShowComments] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setShowProjectForm(true);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleProjectSuccess = () => {
    setShowProjectForm(false);
    setEditingProject(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleViewComments = (project: any) => {
    setShowComments(project);
  };

  const handleCommentsClose = () => {
    setShowComments(null);
    setRefreshTrigger(prev => prev + 1);
  };

  // Show access denied for non-admin users
  if (profile?.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this page.
            </p>
            <Button onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.name}</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleCreateProject}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Active projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Active team members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">Overall completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Project Management */}
        {showProjectForm ? (
          <Card>
            <CardHeader>
              <CardTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectForm
                onSuccess={handleProjectSuccess}
                onCancel={() => setShowProjectForm(false)}
                editProject={editingProject}
              />
            </CardContent>
          </Card>
        ) : (
          <ProjectList
            onEditProject={handleEditProject}
            onViewComments={handleViewComments}
            refreshTrigger={refreshTrigger}
          />
        )}

        {/* Comments Modal */}
        {showComments && (
          <ProjectComments
            project={showComments}
            onClose={handleCommentsClose}
            onCommentAdded={() => setRefreshTrigger(prev => prev + 1)}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;