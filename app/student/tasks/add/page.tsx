'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { CheckSquare, ArrowLeft, Plus, Trash2 } from 'lucide-react'

interface TargetSchool {
  id: string
  school_name: string
}

export default function AddTasksPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [schools, setSchools] = useState<TargetSchool[]>([])
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState<any[]>([{
    task_type: 'essay',
    title: '',
    description: '',
    due_date: '',
    status: 'pending',
    priority: 'medium',
    school_id: '',
  }])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?redirect=/student/tasks/add')
        return
      }
      setUser(user)

      const { data: profileData } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()
      setProfile(profileData)

      // Get schools for dropdown
      const { data: schoolsData } = await supabase
        .from('target_schools')
        .select('id, school_name')
        .eq('student_id', profileData?.id)
      setSchools(schoolsData || [])
    }
    checkUser()
  }, [router, supabase])

  const addTask = () => {
    setTasks([...tasks, {
      task_type: 'essay',
      title: '',
      description: '',
      due_date: '',
      status: 'pending',
      priority: 'medium',
      school_id: '',
    }])
  }

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const updateTask = (index: number, field: string, value: string) => {
    const updated = [...tasks]
    updated[index] = { ...updated[index], [field]: value }
    setTasks(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setLoading(true)

    try {
      const validTasks = tasks.filter(t => t.title.trim() !== '')
      
      const { error } = await supabase
        .from('application_tasks')
        .insert(validTasks.map(t => ({
          student_id: profile.id,
          task_type: t.task_type,
          title: t.title,
          description: t.description || null,
          due_date: t.due_date || null,
          status: t.status,
          priority: t.priority,
          school_id: t.school_id || null,
        })))

      if (error) throw error
      router.push('/student')
    } catch (error) {
      console.error('Error adding tasks:', error)
      alert('Failed to add tasks')
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
            <CheckSquare className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Add Tasks</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {tasks.map((task, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 relative">
                {tasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTask(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}

                <h3 className="font-medium text-gray-900 mb-4">Task {index + 1}</h3>

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Type
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={task.task_type}
                        onChange={(e) => updateTask(index, 'task_type', e.target.value)}
                      >
                        <option value="essay">Essay</option>
                        <option value="recommendation">Recommendation</option>
                        <option value="transcript">Transcript</option>
                        <option value="test_score">Test Score</option>
                        <option value="interview">Interview</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Related School
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={task.school_id}
                        onChange={(e) => updateTask(index, 'school_id', e.target.value)}
                      >
                        <option value="">None</option>
                        {schools.map(s => (
                          <option key={s.id} value={s.id}>{s.school_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Common App Essay"
                      value={task.title}
                      onChange={(e) => updateTask(index, 'title', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={2}
                      placeholder="Optional details..."
                      value={task.description}
                      onChange={(e) => updateTask(index, 'description', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={task.due_date}
                        onChange={(e) => updateTask(index, 'due_date', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={task.status}
                        onChange={(e) => updateTask(index, 'status', e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={task.priority}
                        onChange={(e) => updateTask(index, 'priority', e.target.value)}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addTask}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Another Task
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
                {loading ? 'Saving...' : 'Save Tasks'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
