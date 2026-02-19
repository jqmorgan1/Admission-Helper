'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { GraduationCap, ArrowLeft, Plus, Trash2 } from 'lucide-react'

export default function AddSchoolsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [schools, setSchools] = useState<any[]>([{
    school_name: '',
    school_type: 'mid',
    application_status: 'not_started',
    deadline: '',
    notes: '',
  }])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?redirect=/student/schools/add')
        return
      }
      setUser(user)

      const { data: profileData } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()
      setProfile(profileData)
    }
    checkUser()
  }, [router, supabase])

  const addSchool = () => {
    setSchools([...schools, {
      school_name: '',
      school_type: 'mid',
      application_status: 'not_started',
      deadline: '',
      notes: '',
    }])
  }

  const removeSchool = (index: number) => {
    setSchools(schools.filter((_, i) => i !== index))
  }

  const updateSchool = (index: number, field: string, value: string) => {
    const updated = [...schools]
    updated[index] = { ...updated[index], [field]: value }
    setSchools(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setLoading(true)

    try {
      const validSchools = schools.filter(s => s.school_name.trim() !== '')
      
      const { error } = await supabase
        .from('target_schools')
        .insert(validSchools.map(s => ({
          student_id: profile.id,
          school_name: s.school_name,
          school_type: s.school_type,
          application_status: s.application_status,
          deadline: s.deadline || null,
          notes: s.notes || null,
        })))

      if (error) throw error
      router.push('/student')
    } catch (error) {
      console.error('Error adding schools:', error)
      alert('Failed to add schools')
    } finally {
      setLoading(false)
    }
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Add Target Schools</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {schools.map((school, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 relative">
                {schools.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSchool(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}

                <h3 className="font-medium text-gray-900 mb-4">School {index + 1}</h3>

                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      School Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Stanford University"
                      value={school.school_name}
                      onChange={(e) => updateSchool(index, 'school_name', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        School Type
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={school.school_type}
                        onChange={(e) => updateSchool(index, 'school_type', e.target.value)}
                      >
                        <option value="ivy">Ivy League</option>
                        <option value="top">Top 20</option>
                        <option value="mid">Mid Tier</option>
                        <option value="safety">Safety</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={school.application_status}
                        onChange={(e) => updateSchool(index, 'application_status', e.target.value)}
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="submitted">Submitted</option>
                        <option value="accepted">Accepted</option>
                        <option value="waitlisted">Waitlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deadline
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={school.deadline}
                        onChange={(e) => updateSchool(index, 'deadline', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Optional notes"
                        value={school.notes}
                        onChange={(e) => updateSchool(index, 'notes', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addSchool}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Another School
            </button>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Schools'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
