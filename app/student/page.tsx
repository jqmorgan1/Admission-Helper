'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import {
  GraduationCap,
  Trophy,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Target,
  TrendingUp,
  FileText,
  Mail,
  Calendar,
  ChevronRight,
} from 'lucide-react'

interface Task {
  id: string
  title: string
  status: string
  priority: string
  due_date?: string
}

interface TargetSchool {
  id: string
  school_name: string
  school_type: string
  application_status: string
  deadline?: string
}

interface AdmissionResult {
  id: string
  school_name: string
  result: string
  anonymous_id: string
  created_at: string
}

export default function StudentDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [targetSchools, setTargetSchools] = useState<TargetSchool[]>([])
  const [recentResults, setRecentResults] = useState<AdmissionResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login?redirect=/student')
        return
      }

      setUser(user)

      // Get profile
      const { data: profileData } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setProfile(profileData)

      // Get tasks
      const { data: tasksData } = await supabase
        .from('application_tasks')
        .select('*')
        .eq('student_id', profileData?.id)
        .in('status', ['pending', 'in_progress'])
        .order('due_date', { ascending: true })
        .limit(5)

      setTasks(tasksData || [])

      // Get target schools
      const { data: schoolsData } = await supabase
        .from('target_schools')
        .select('*')
        .eq('student_id', profileData?.id)
        .order('created_at', { ascending: false })

      setTargetSchools(schoolsData || [])

      // Get recent admission results
      const { data: resultsData } = await supabase
        .from('admission_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      setRecentResults(resultsData || [])
      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  const pendingTasks = tasks.filter(t => t.status === 'pending').length
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
  const submittedSchools = targetSchools.filter(s => ['submitted', 'accepted', 'rejected'].includes(s.application_status)).length

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      waitlisted: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-indigo-100 text-indigo-800',
    }
    return styles[status] || styles.pending
  }

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    }
    return styles[priority] || styles.low
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {profile?.display_name || 'Student'}
              </h1>
              <p className="text-gray-600">
                Class of {profile?.graduation_year || '2026'}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/student/schools/add"
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add School
              </Link>
              <Link
                href="/student/tasks/add"
                className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Task
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Target Schools</p>
                <p className="text-3xl font-bold text-gray-900">{targetSchools.length}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="text-3xl font-bold text-gray-900">{submittedSchools}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{pendingTasks}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">{inProgressTasks}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Tasks & Schools */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tasks */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
                  <Link href="/student/tasks" className="text-indigo-600 hover:text-indigo-700 text-sm">
                    View all
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {tasks.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No pending tasks</p>
                    <Link href="/student/tasks/add" className="text-indigo-600 hover:text-indigo-700 text-sm">
                      Add your first task
                    </Link>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            task.priority === 'high' ? 'bg-red-500' : 
                            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <div>
                            <p className="font-medium text-gray-900">{task.title}</p>
                            {task.due_date && (
                              <p className="text-sm text-gray-500">
                                Due: {new Date(task.due_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Target Schools */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Target Schools</h2>
                  <Link href="/student/schools" className="text-indigo-600 hover:text-indigo-700 text-sm">
                    View all
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {targetSchools.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No schools added yet</p>
                    <Link href="/student/schools/add" className="text-indigo-600 hover:text-indigo-700 text-sm">
                      Add your first school
                    </Link>
                  </div>
                ) : (
                  targetSchools.slice(0, 5).map((school) => (
                    <div key={school.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{school.school_name}</p>
                          <p className="text-sm text-gray-500 capitalize">{school.school_type} school</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {school.deadline && (
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(school.deadline).toLocaleDateString()}
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(school.application_status)}`}>
                            {school.application_status.replace('_', ' ')}
                          </span>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Results Feed */}
          <div className="space-y-8">
            {/* Add Result */}
            <div className="bg-indigo-600 rounded-xl shadow-sm p-6 text-white">
              <h3 className="font-semibold mb-2">Share Your Result</h3>
              <p className="text-indigo-100 text-sm mb-4">
                Help others by sharing your admission results anonymously.
              </p>
              <Link
                href="/student/results/add"
                className="block w-full bg-white text-indigo-600 text-center py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
              >
                Add Result
              </Link>
            </div>

            {/* Recent Results */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Recent Results</h2>
                </div>
              </div>
              <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
                {recentResults.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p>No results yet</p>
                  </div>
                ) : (
                  recentResults.map((result) => (
                    <div key={result.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{result.school_name}</p>
                          <p className="text-sm text-gray-500">
                            {result.anonymous_id.substring(0, 8)} • {new Date(result.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(result.result)}`}>
                          {result.result}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t border-gray-200">
                <Link href="/results" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  View all results →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
