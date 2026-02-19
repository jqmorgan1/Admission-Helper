'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import {
  Building2,
  Users,
  Search,
  Filter,
  Eye,
  TrendingUp,
  BarChart3,
  Download,
  ChevronRight,
} from 'lucide-react'

interface StudentProfile {
  id: string
  display_name: string
  gpa?: number
  sat_score?: number
  act_score?: number
  intended_major?: string
  graduation_year: number
  privacy_level: string
  created_at: string
}

interface SchoolProfile {
  id: string
  school_name: string
  subscription_tier: string
}

export default function SchoolDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<SchoolProfile | null>(null)
  const [students, setStudents] = useState<StudentProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMajor, setFilterMajor] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login?redirect=/school')
        return
      }

      setUser(user)

      // Get school profile
      const { data: profileData } = await supabase
        .from('school_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setProfile(profileData)

      // Get students (for now, show public profiles)
      const { data: studentsData } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50)

      setStudents(studentsData || [])
      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.intended_major?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMajor = !filterMajor || student.intended_major === filterMajor
    return matchesSearch && matchesMajor
  })

  const stats = {
    totalStudents: students.length,
    withScores: students.filter(s => s.gpa || s.sat_score).length,
    avgGpa: students.length > 0 
      ? (students.reduce((acc, s) => acc + (s.gpa || 0), 0) / students.filter(s => s.gpa).length || 0).toFixed(2)
      : 'N/A',
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
                {profile?.school_name || 'School Dashboard'}
              </h1>
              <p className="text-gray-600 capitalize">
                {profile?.subscription_tier || 'Free'} Plan
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <Download className="h-5 w-5" />
                Export
              </button>
              <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                <BarChart3 className="h-5 w-5" />
                Analytics
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Test Scores</p>
                <p className="text-3xl font-bold text-gray-900">{stats.withScores}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg GPA (of known)</p>
                <p className="text-3xl font-bold text-gray-900">{stats.avgGpa}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name or major..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filterMajor}
                onChange={(e) => setFilterMajor(e.target.value)}
              >
                <option value="">All Majors</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
                <option value="Arts">Arts</option>
                <option value="Sciences">Sciences</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Potential Applicants</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No students found matching your criteria</p>
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">
                          {student.display_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.display_name}</p>
                        <p className="text-sm text-gray-500">
                          Class of {student.graduation_year} • {student.intended_major || 'Undeclared'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {student.gpa && (
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">{student.gpa}</p>
                          <p className="text-xs text-gray-500">GPA</p>
                        </div>
                      )}
                      {student.sat_score && (
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">{student.sat_score}</p>
                          <p className="text-xs text-gray-500">SAT</p>
                        </div>
                      )}
                      <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700">
                        <Eye className="h-5 w-5" />
                        <span className="text-sm">View Profile</span>
                      </button>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upgrade CTA */}
        {profile?.subscription_tier === 'free' && (
          <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
                <p className="text-indigo-100">
                  Get access to advanced analytics, direct messaging, and more.
                </p>
              </div>
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
