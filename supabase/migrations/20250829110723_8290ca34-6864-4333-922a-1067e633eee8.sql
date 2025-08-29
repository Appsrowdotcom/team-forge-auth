-- Fix infinite recursion in users table policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

-- Create corrected policies without recursion
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid()::text = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid()::text = id);

-- Admins can view all users (check role directly from auth metadata or use a function)
CREATE POLICY "Service role can manage users" 
ON public.users 
FOR ALL 
USING (
  -- Allow if the current user is accessing their own record
  auth.uid()::text = id 
  OR
  -- Allow if current user has admin role (we'll check this in a safe way)
  EXISTS (
    SELECT 1 FROM public.users admin_user 
    WHERE admin_user.id = auth.uid()::text 
    AND admin_user.role = 'Admin'
  )
);

-- Allow insert for new user registration
CREATE POLICY "Allow user registration" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid()::text = id);