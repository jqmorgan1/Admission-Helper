'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Trophy, ArrowLeft } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

export default function AddResultPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    school_name: '',
    school_type: 'mid',
    result: 'accepted',
    major: '',
  })

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?redirect=/student/results/add')
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

  const generateAnonymousId = () => {
    return `Student-${uuidv4().substring(0, 8)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setLoading(true)

    try {
      const { error } = await supabase
        .from('admission_results')
        .insert({
          student_id: profile.id,
          school_name: formData.school_name,
          school_type: formData.school_type,
          result: formData.result,
          major: formData.major || null,
          is_accepted: formData.result === 'accepted',
          anonymous_id: generateAnonymousId(),
        })

      if (error) throw error
      router.push('/results')
    } catch (error) {
      console.error('Error adding result:', error)
      alert('Failed to add result')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Share Admission Result</h1>
              <p className="text-gray-600">Your identity will remain anonymous</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Stanford University"
                value={formData.school_name}
                onChange={(e) => updateField('school_name', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Type
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.school_type}
                  onChange={(e) => updateField('school_type', e.target.value)}
                >
                  <option value="ivy">Ivy League</option>
                  <option value="top">Top 20</option>
                  <option value="mid">Mid Tier</option>
                  <option value="safety">Safety</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Result *
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.result}
                  onChange={(e) => updateField('result', e.target.value)}
                >
                  <option value="accepted">Accepted 🎉</option>
                  <option value="rejected">Rejected</option>
                  <option value="waitlisted">Waitlisted</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Major (Optional)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Computer Science"
                value={formData.major}
                onChange={(e) => updateField('major', e.target.value)}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Privacy Note:</strong> Your result will be shared with an anonymous ID 
                (e.g., "Student-abc12345"). Other users won't be able to identify you, 
                but schools can view this data.
              </p>
            </div>

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
                {loading ? 'Sharing...' : 'Share Result'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
