import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Users, FolderOpen, BarChart3, Plus, ArrowLeft, TrendingUp } from 'lucide-react';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { ProjectList } from '@/components/projects/ProjectList';
import { ProjectComments } from '@/components/projects/ProjectComments';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskComments } from '@/components/tasks/TaskComments';
import { TaskDetail } from '@/components/tasks/TaskDetail';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

const AdminDashboard: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [showComments, setShowComments] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Task management states
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [showTaskComments, setShowTaskComments] = useState<any>(null);
  
  // Detail view states
  const [showProjectDetail, setShowProjectDetail] = useState<any>(null);
  const [showTaskDetail, setShowTaskDetail] = useState<any>(null);

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
    setShowProjectDetail(null);
  };

  const handleProjectSuccess = () => {
    setShowProjectForm(false);
    setEditingProject(null);
    setShowProjectDetail(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleViewComments = (project: any) => {
    setShowComments(project);
    setShowProjectDetail(null);
  };

  const handleCommentsClose = () => {
    setShowComments(null);
    setRefreshTrigger(prev => prev + 1);
  };

  // Task management handlers
  const handleViewTasks = (project: any) => {
    setSelectedProject(project);
    setShowProjectForm(false);
    setShowComments(null);
    setShowProjectDetail(null);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setShowTaskForm(false);
    setEditingTask(null);
    setShowTaskComments(null);
    setShowTaskDetail(null);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setShowTaskForm(true);
    setShowTaskDetail(null);
  };

  const handleTaskSuccess = () => {
    setShowTaskForm(false);
    setEditingTask(null);
    setShowTaskDetail(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTaskComments = (task: any) => {
    setShowTaskComments(task);
    setShowTaskDetail(null);
  };

  const handleTaskCommentsClose = () => {
    setShowTaskComments(null);
    setRefreshTrigger(prev => prev + 1);
  };

  // Detail view handlers
  const handleViewProjectDetail = (project: any) => {
    setShowProjectDetail(project);
    setShowProjectForm(false);
    setShowComments(null);
    setSelectedProject(null);
    setShowTaskDetail(null);
  };

  const handleViewTaskDetail = (task: any) => {
    setShowTaskDetail(task);
    setShowTaskForm(false);
    setShowTaskComments(null);
    setEditingTask(null);
  };

  const handleBackFromProjectDetail = () => {
    setShowProjectDetail(null);
  };

  const handleBackFromTaskDetail = () => {
    setShowTaskDetail(null);
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
            {activeTab === 'projects' && (
              <Button onClick={handleCreateProject}>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            )}
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

            {/* Content Management */}
            {selectedProject ? (
              // Task Management View
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={handleBackToProjects}>
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Projects
                        </Button>
                        <div>
                          <CardTitle>Project: {selectedProject.name}</CardTitle>
                          <p className="text-muted-foreground">Manage tasks for this project</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {showTaskForm ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TaskForm
                        projectId={selectedProject.id}
                        editTask={editingTask}
                        onSuccess={handleTaskSuccess}
                        onCancel={() => setShowTaskForm(false)}
                      />
                    </CardContent>
                  </Card>
                ) : showTaskDetail ? (
                  // Task Detail View
                  <TaskDetail
                    task={showTaskDetail}
                    onBack={handleBackFromTaskDetail}
                    onEdit={handleEditTask}
                    onViewComments={handleTaskComments}
                  />
                ) : (
                  <TaskList
                    projectId={selectedProject.id}
                    projectName={selectedProject.name}
                    onCreateTask={handleCreateTask}
                    onEditTask={handleEditTask}
                    onTaskComments={handleTaskComments}
                    onViewDetails={handleViewTaskDetail}
                    refreshTrigger={refreshTrigger}
                  />
                )}
              </div>
            ) : showProjectForm ? (
              // Project Form View
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
            ) : showProjectDetail ? (
              // Project Detail View
              <ProjectDetail
                project={showProjectDetail}
                onBack={handleBackFromProjectDetail}
                onEdit={handleEditProject}
                onViewComments={handleViewComments}
                onViewTasks={handleViewTasks}
              />
            ) : (
              // Project List View
              <ProjectList
                onEditProject={handleEditProject}
                onViewComments={handleViewComments}
                onViewTasks={handleViewTasks}
                onViewDetails={handleViewProjectDetail}
                refreshTrigger={refreshTrigger}
              />
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>
                  Quick overview of system status and recent activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-muted-foreground">Active Projects</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-muted-foreground">Completed Tasks</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">0</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">0h</div>
                    <div className="text-sm text-muted-foreground">Total Hours</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        {showComments && (
          <ProjectComments
            project={showComments}
            onClose={handleCommentsClose}
            onCommentAdded={() => setRefreshTrigger(prev => prev + 1)}
          />
        )}

        {showTaskComments && (
          <TaskComments
            task={showTaskComments}
            onClose={handleTaskCommentsClose}
            onCommentAdded={handleTaskCommentsClose}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;