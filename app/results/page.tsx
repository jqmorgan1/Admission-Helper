'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Trophy, TrendingUp, Users, Filter } from 'lucide-react'
import { getResultColor } from '@/lib/utils'

interface AdmissionResult {
  id: string
  school_name: string
  school_type: string
  result: string
  major?: string
  anonymous_id: string
  created_at: string
}

export default function ResultsPage() {
  const supabase = createClient()
  const [results, setResults] = useState<AdmissionResult[]>([])
  const [loading, setLoading] = useState(true)
  const [filterSchool, setFilterSchool] = useState('')
  const [filterResult, setFilterResult] = useState('')
  const [stats, setStats] = useState({ accepted: 0, rejected: 0, waitlisted: 0 })

  useEffect(() => {
    const fetchResults = async () => {
      let query = supabase
        .from('admission_results')
        .select('*')
        .order('created_at', { ascending: false })

      if (filterResult) {
        query = query.eq('result', filterResult)
      }

      const { data, error } = await query

      if (!error && data) {
        setResults(data)
        setStats({
          accepted: data.filter(r => r.result === 'accepted').length,
          rejected: data.filter(r => r.result === 'rejected').length,
          waitlisted: data.filter(r => r.result === 'waitlisted').length,
        })
      }
      setLoading(false)
    }

    fetchResults()
  }, [supabase, filterResult])

  const filteredResults = results.filter(r => {
    if (filterSchool && !r.school_name.toLowerCase().includes(filterSchool.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            College Admission Results
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Anonymous results from students sharing their acceptance, rejection, and waitlist outcomes.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-4xl font-bold text-green-600">{stats.accepted}</p>
            <p className="text-gray-600">Accepted</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-4xl font-bold text-red-600">{stats.rejected}</p>
            <p className="text-gray-600">Rejected</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-4xl font-bold text-yellow-600">{stats.waitlisted}</p>
            <p className="text-gray-600">Waitlisted</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-4xl font-bold text-indigo-600">{results.length}</p>
            <p className="text-gray-600">Total Results</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Filter by school name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filterSchool}
                onChange={(e) => setFilterSchool(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filterResult}
                onChange={(e) => setFilterResult(e.target.value)}
              >
                <option value="">All Results</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="waitlisted">Waitlisted</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Feed */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No results found</p>
              </div>
            ) : (
              filteredResults.map((result) => (
                <div key={result.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{result.school_name}</h3>
                      {result.major && (
                        <p className="text-gray-600">Major: {result.major}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        Reported by {result.anonymous_id} • {new Date(result.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getResultColor(result.result)}`}>
                        {result.result}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Share CTA */}
        <div className="mt-8 bg-indigo-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Share Your Result</h3>
          <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
            Help other students by sharing your admission outcome. Your identity remains completely anonymous.
          </p>
          <a
            href="/student/results/add"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Share Now
          </a>
        </div>
      </div>
    </div>
  )
}
