-- Database Schema for Admission Tracker
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'school', 'admin');
CREATE TYPE school_type AS ENUM ('ivy', 'top', 'mid', 'safety');
CREATE TYPE application_status AS ENUM ('dream', 'target', 'safety', 'not_started', 'in_progress', 'submitted', 'accepted', 'waitlisted', 'rejected');
CREATE TYPE privacy_level AS ENUM ('public', 'friends', 'private');
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'premium');
CREATE TYPE admission_result AS ENUM ('accepted', 'waitlisted', 'rejected', 'pending');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_type AS ENUM ('essay', 'recommendation', 'transcript', 'test_score', 'interview', 'other');

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student Profiles
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  gpa DECIMAL(3, 2),
  sat_score INTEGER,
  act_score INTEGER,
  intended_major TEXT,
  graduation_year INTEGER NOT NULL,
  bio TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  privacy_level privacy_level NOT NULL DEFAULT 'public',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- School Profiles
CREATE TABLE school_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  school_logo TEXT,
  contact_email TEXT NOT NULL,
  description TEXT,
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Target Schools (student's college list)
CREATE TABLE target_schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  school_type school_type NOT NULL DEFAULT 'mid',
  application_status application_status NOT NULL DEFAULT 'not_started',
  deadline DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Application Tasks
CREATE TABLE application_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  school_id UUID REFERENCES target_schools(id) ON DELETE SET NULL,
  task_type task_type NOT NULL DEFAULT 'essay',
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status task_status NOT NULL DEFAULT 'pending',
  priority task_priority NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admission Results (anonymous feed)
CREATE TABLE admission_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  school_type school_type NOT NULL DEFAULT 'mid',
  result admission_result NOT NULL,
  major TEXT,
  is_accepted BOOLEAN NOT NULL,
  anonymous_id TEXT NOT NULL, -- Generated ID like "Student-abc123"
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- School Following (schools can follow students they're interested in)
CREATE TABLE school_follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES school_profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(school_id, student_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX idx_student_profiles_privacy ON student_profiles(is_public, privacy_level);
CREATE INDEX idx_target_schools_student_id ON target_schools(student_id);
CREATE INDEX idx_application_tasks_student_id ON application_tasks(student_id);
CREATE INDEX idx_application_tasks_status ON application_tasks(status);
CREATE INDEX idx_admission_results_school_name ON admission_results(school_name);
CREATE INDEX idx_admission_results_result ON admission_results(result);
CREATE INDEX idx_school_follows_school_id ON school_follows(school_id);
CREATE INDEX idx_school_follows_student_id ON school_follows(student_id);

-- Row Level Security Policies

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE target_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_follows ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Student Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON student_profiles FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON student_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON student_profiles FOR UPDATE USING (auth.uid() = user_id);

-- School Profiles policies
CREATE POLICY "Schools are viewable by everyone" ON school_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own school profile" ON school_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own school profile" ON school_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Target Schools policies
CREATE POLICY "Students can view own schools" ON target_schools FOR SELECT USING (
  EXISTS (SELECT 1 FROM student_profiles WHERE id = student_id AND user_id = auth.uid())
);
CREATE POLICY "Students can manage own schools" ON target_schools FOR ALL USING (
  EXISTS (SELECT 1 FROM student_profiles WHERE id = student_id AND user_id = auth.uid())
);

-- Application Tasks policies
CREATE POLICY "Students can view own tasks" ON application_tasks FOR SELECT USING (
  EXISTS (SELECT 1 FROM student_profiles WHERE id = student_id AND user_id = auth.uid())
);
CREATE POLICY "Students can manage own tasks" ON application_tasks FOR ALL USING (
  EXISTS (SELECT 1 FROM student_profiles WHERE id = student_id AND user_id = auth.uid())
);

-- Admission Results policies (anonymous, so more permissive)
CREATE POLICY "Results are viewable by everyone" ON admission_results FOR SELECT USING (true);
CREATE POLICY "Students can insert own results" ON admission_results FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM student_profiles WHERE id = student_id AND user_id = auth.uid())
);

-- School Follows policies
CREATE POLICY "Schools can view own follows" ON school_follows FOR SELECT USING (
  EXISTS (SELECT 1 FROM school_profiles WHERE id = school_id AND user_id = auth.uid())
);
CREATE POLICY "Schools can manage own follows" ON school_follows FOR ALL USING (
  EXISTS (SELECT 1 FROM school_profiles WHERE id = school_id AND user_id = auth.uid())
);

-- Trigger function to create user record on auth.users creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (new.id, new.email, COALESCE(
    (SELECT (raw_app_meta_data->>'role')::user_role FROM auth.users WHERE id = new.id),
    'student'
  ));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_school_profiles_updated_at BEFORE UPDATE ON school_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_target_schools_updated_at BEFORE UPDATE ON target_schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_application_tasks_updated_at BEFORE UPDATE ON application_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
