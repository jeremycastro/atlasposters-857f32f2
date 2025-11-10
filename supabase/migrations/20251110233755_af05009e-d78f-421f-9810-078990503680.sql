-- =====================================================
-- Phase 1.1: Core Infrastructure Database Schema
-- 5-Role System with Multi-Role Support
-- =====================================================

-- ============ ENUMS ============

-- Create role enum with all 5 roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer', 'partner', 'customer');

-- Task status enum
CREATE TYPE public.task_status AS ENUM (
  'backlog',
  'todo',
  'in_progress',
  'in_review',
  'blocked',
  'completed',
  'cancelled'
);

-- Task priority enum
CREATE TYPE public.task_priority AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

-- ============ PROFILES TABLE ============

-- Create profiles table (unified profile for all user types)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  
  -- Shopify/platform sync fields
  shopify_customer_id TEXT UNIQUE,
  platform_customer_ids JSONB DEFAULT '{}'::jsonb,
  last_synced_at TIMESTAMPTZ,
  sync_status TEXT,
  
  -- Customer-specific fields (nullable, only used by customers)
  shipping_address JSONB,
  billing_address JSONB,
  loyalty_points INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  customer_since TIMESTAMPTZ,
  
  -- Partner-specific fields (nullable, only used by partners)
  partner_company_name TEXT,
  partner_website TEXT,
  partner_contact_email TEXT,
  partner_type TEXT,
  partner_status TEXT,
  partner_since TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  preferences JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for common queries
CREATE INDEX idx_profiles_shopify_customer ON public.profiles(shopify_customer_id);
CREATE INDEX idx_profiles_partner_type ON public.profiles(partner_type);
CREATE INDEX idx_profiles_partner_status ON public.profiles(partner_status);

-- ============ USER ROLES TABLE ============

-- Create user_roles table (supports multiple roles per user)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES public.profiles(id),
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  UNIQUE(user_id, role)
);

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_user_roles_active ON public.user_roles(user_id, is_active);

-- ============ USER ROLE SESSIONS TABLE ============

-- Create user_role_sessions table (tracks which role user is currently using)
CREATE TABLE public.user_role_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  active_role public.app_role NOT NULL,
  session_started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_role_sessions_user ON public.user_role_sessions(user_id);

-- ============ SECURITY DEFINER FUNCTIONS ============

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
    AND is_active = true
  )
$$;

-- Create function to get user's active role
CREATE OR REPLACE FUNCTION public.get_active_role(_user_id UUID)
RETURNS public.app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT active_role
  FROM public.user_role_sessions
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Create function to get all roles for a user
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS SETOF public.app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  AND is_active = true
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'editor' THEN 2
      WHEN 'partner' THEN 3
      WHEN 'viewer' THEN 4
      WHEN 'customer' THEN 5
    END
$$;

-- ============ TRIGGERS ============

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  );
  
  -- Auto-assign 'customer' role to all new signups
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  -- Set initial active role to 'customer'
  INSERT INTO public.user_role_sessions (user_id, active_role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============ PROJECT TASKS TABLE ============

CREATE TABLE public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status public.task_status DEFAULT 'backlog',
  priority public.task_priority DEFAULT 'medium',
  
  -- Assignment & ownership
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  assigned_to UUID REFERENCES public.profiles(id),
  
  -- Organization
  phase TEXT,
  milestone TEXT,
  tags TEXT[],
  
  -- Checklist support (JSON array of checklist items)
  checklist JSONB DEFAULT '[]'::jsonb,
  
  -- Dependencies
  depends_on UUID[],
  blocks UUID[],
  
  -- Dates
  due_date TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata
  estimated_hours INTEGER,
  actual_hours INTEGER,
  notes TEXT
);

-- Create indexes for common queries
CREATE INDEX idx_tasks_status ON public.project_tasks(status);
CREATE INDEX idx_tasks_assigned_to ON public.project_tasks(assigned_to);
CREATE INDEX idx_tasks_created_by ON public.project_tasks(created_by);
CREATE INDEX idx_tasks_priority ON public.project_tasks(priority);
CREATE INDEX idx_tasks_phase_milestone ON public.project_tasks(phase, milestone);
CREATE INDEX idx_tasks_tags ON public.project_tasks USING GIN(tags);

-- ============ TASK COMMENTS TABLE ============

CREATE TABLE public.task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.project_tasks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_task_comments_task ON public.task_comments(task_id);
CREATE INDEX idx_task_comments_user ON public.task_comments(user_id);

-- ============ TASK ACTIVITY TABLE ============

CREATE TABLE public.task_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.project_tasks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  action TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_task_activity_task ON public.task_activity(task_id);
CREATE INDEX idx_task_activity_user ON public.task_activity(user_id);

-- ============ ROW LEVEL SECURITY ============

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_role_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_activity ENABLE ROW LEVEL SECURITY;

-- ============ PROFILES RLS POLICIES ============

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Partners can view partner profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'partner')
    AND partner_status = 'active'
  );

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ USER ROLES RLS POLICIES ============

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============ USER ROLE SESSIONS RLS POLICIES ============

CREATE POLICY "Users can view own role session"
  ON public.user_role_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own role session"
  ON public.user_role_sessions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own role session"
  ON public.user_role_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all role sessions"
  ON public.user_role_sessions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ PROJECT TASKS RLS POLICIES ============

CREATE POLICY "Admins can do anything with tasks"
  ON public.project_tasks FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors can view all tasks"
  ON public.project_tasks FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'editor')
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Editors can create tasks"
  ON public.project_tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'editor')
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Editors can update all tasks"
  ON public.project_tasks FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'editor')
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Viewers can view relevant tasks"
  ON public.project_tasks FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'viewer')
    AND (created_by = auth.uid() OR assigned_to = auth.uid())
  );

CREATE POLICY "Partners can view partner tasks"
  ON public.project_tasks FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'partner')
    AND (
      'partner' = ANY(tags)
      OR assigned_to = auth.uid()
      OR created_by = auth.uid()
    )
  );

-- ============ TASK COMMENTS RLS POLICIES ============

CREATE POLICY "Users can view comments on accessible tasks"
  ON public.task_comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.project_tasks
      WHERE id = task_id
    )
  );

CREATE POLICY "Users can add comments to accessible tasks"
  ON public.task_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.project_tasks
      WHERE id = task_id
    )
  );

CREATE POLICY "Users can update own comments"
  ON public.task_comments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- ============ TASK ACTIVITY RLS POLICIES ============

CREATE POLICY "Users can view activity on accessible tasks"
  ON public.task_activity FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.project_tasks
      WHERE id = task_id
    )
  );

CREATE POLICY "System can log task activity"
  ON public.task_activity FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============ STORAGE BUCKETS ============

-- Create avatars bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ============ STORAGE RLS POLICIES ============

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );