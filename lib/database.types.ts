export type UserRole = 'student' | 'school' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface StudentProfile {
  id: string
  user_id: string
  display_name: string
  avatar_url?: string
  gpa?: number
  sat_score?: number
  act_score?: number
  intended_major?: string
  graduation_year: number
  bio?: string
  is_public: boolean
  privacy_level: 'public' | 'friends' | 'private'
  created_at: string
  updated_at: string
}

export interface SchoolProfile {
  id: string
  user_id: string
  school_name: string
  school_logo?: string
  contact_email: string
  description?: string
  subscription_tier: 'free' | 'basic' | 'premium'
  created_at: string
  updated_at: string
}

export interface TargetSchool {
  id: string
  student_id: string
  school_name: string
  school_type: 'ivy' | 'top' | 'mid' | 'safety'
  application_status: 'dream' | 'target' | 'safety' | 'not_started' | 'in_progress' | 'submitted' | 'accepted' | 'waitlisted' | 'rejected'
  deadline?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ApplicationTask {
  id: string
  student_id: string
  school_id?: string
  task_type: 'essay' | 'recommendation' | 'transcript' | 'test_score' | 'interview' | 'other'
  title: string
  description?: string
  due_date?: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
}

export interface AdmissionResult {
  id: string
  student_id: string
  school_name: string
  school_type: 'ivy' | 'top' | 'mid' | 'safety'
  result: 'accepted' | 'waitlisted' | 'rejected' | 'pending'
  major?: string
  is_accepted: boolean
  anonymous_id: string
  created_at: string
}

export interface StudentFollow {
  id: string
  school_id: string
  student_id: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id'>>
      }
      student_profiles: {
        Row: StudentProfile
        Insert: Omit<StudentProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StudentProfile, 'id'>>
      }
      school_profiles: {
        Row: SchoolProfile
        Insert: Omit<SchoolProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SchoolProfile, 'id'>>
      }
      target_schools: {
        Row: TargetSchool
        Insert: Omit<TargetSchool, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<TargetSchool, 'id'>>
      }
      application_tasks: {
        Row: ApplicationTask
        Insert: Omit<ApplicationTask, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ApplicationTask, 'id'>>
      }
      admission_results: {
        Row: AdmissionResult
        Insert: Omit<AdmissionResult, 'id' | 'created_at'>
        Update: Partial<Omit<AdmissionResult, 'id'>>
      }
      school_follows: {
        Row: StudentFollow
        Insert: Omit<StudentFollow, 'id' | 'created_at'>
        Update: Partial<Omit<StudentFollow, 'id'>>
      }
    }
  }
}
