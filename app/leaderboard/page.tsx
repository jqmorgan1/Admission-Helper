'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Trophy, Medal, TrendingUp, Calendar, Target } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  display_name: string
  graduation_year: number
  accepted_count: number
  submitted_count: number
  task_completed_count: number
}

export default function LeaderboardPage() {
  const supabase = createClient()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('all')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // This is a mock - in production you'd aggregate real data
      const mockData: LeaderboardEntry[] = [
        { id: '1', display_name: 'Alex', graduation_year: 2026, accepted_count: 3, submitted_count: 8, task_completed_count: 45 },
        { id: '2', display_name: 'Sarah', graduation_year: 2026, accepted_count: 2, submitted_count: 7, task_completed_count: 38 },
        { id: '3', display_name: 'Michael', graduation_year: 2026, accepted_count: 2, submitted_count: 6, task_completed_count: 35 },
        { id: '4', display_name: 'Emma', graduation_year: 2026, accepted_count: 1, submitted_count: 9, task_completed_count: 42 },
        { id: '5', display_name: 'James', graduation_year: 2026, accepted_count: 1, submitted_count: 5, task_completed_count: 28 },
        { id: '6', display_name: 'Olivia', graduation_year: 2026, accepted_count: 1, submitted_count: 4, task_completed_count: 25 },
        { id: '7', display_name: 'William', graduation_year: 2026, accepted_count: 0, submitted_count: 6, task_completed_count: 32 },
        { id: '8', display_name: 'Sophia', graduation_year: 2026, accepted_count: 0, submitted_count: 5, task_completed_count: 30 },
      ].sort((a, b) => {
        // Sort by accepted count first, then by total progress
        if (b.accepted_count !== a.accepted_count) {
          return b.accepted_count - a.accepted_count
        }
        return b.submitted_count - a.submitted_count
      })

      setEntries(mockData)
      setLoading(false)
    }

    fetchLeaderboard()
  }, [supabase, timeframe])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Competition Leaderboard</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how you stack up against other applicants. Push yourself to submit faster and complete more tasks!
          </p>
        </div>

        {/* Timeframe Filter */}
        <div className="flex justify-center gap-4 mb-8">
          {(['week', 'month', 'all'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tf === 'week' ? 'This Week' : tf === 'month' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 mb-12">
          {entries.length >= 2 && (
            <div className="text-center">
              <div className="bg-gray-200 rounded-xl p-6 w-32 h-40 flex flex-col items-center justify-end">
                <div className="text-4xl mb-2">🥈</div>
                <p className="font-semibold text-gray-900">{entries[1].display_name}</p>
                <p className="text-sm text-gray-600">{entries[1].accepted_count} acceptances</p>
              </div>
              <div className="bg-gray-300 h-8 w-32 rounded-t-lg"></div>
            </div>
          )}
          
          {entries[0] && (
            <div className="text-center">
              <div className="bg-yellow-100 rounded-xl p-6 w-36 h-56 flex flex-col items-center justify-end">
                <div className="text-5xl mb-2">🏆</div>
                <p className="font-bold text-gray-900 text-lg">{entries[0].display_name}</p>
                <p className="text-sm text-gray-600">{entries[0].accepted_count} acceptances</p>
              </div>
              <div className="bg-yellow-400 h-12 w-36 rounded-t-lg"></div>
            </div>
          )}

          {entries.length >= 3 && (
            <div className="text-center">
              <div className="bg-orange-100 rounded-xl p-6 w-32 h-32 flex flex-col items-center justify-end">
                <div className="text-4xl mb-2">🥉</div>
                <p className="font-semibold text-gray-900">{entries[2].display_name}</p>
                <p className="text-sm text-gray-600">{entries[2].accepted_count} acceptances</p>
              </div>
              <div className="bg-orange-300 h-4 w-32 rounded-t-lg"></div>
            </div>
          )}
        </div>

        {/* Full Rankings */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 px-6 py-4 font-medium text-gray-600">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Student</div>
            <div className="col-span-2 text-center">Accepted</div>
            <div className="col-span-2 text-center">Submitted</div>
            <div className="col-span-3 text-center">Tasks Done</div>
          </div>

          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : (
              entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`grid grid-cols-12 px-6 py-4 items-center ${
                    index < 3 ? 'bg-yellow-50/50' : ''
                  }`}
                >
                  <div className="col-span-1">
                    {index === 0 && <Trophy className="h-6 w-6 text-yellow-500" />}
                    {index === 1 && <Medal className="h-6 w-6 text-gray-400" />}
                    {index === 2 && <Medal className="h-6 w-6 text-amber-600" />}
                    {index > 2 && <span className="font-medium text-gray-600">{index + 1}</span>}
                  </div>
                  <div className="col-span-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">
                          {entry.display_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{entry.display_name}</p>
                        <p className="text-sm text-gray-500">Class of {entry.graduation_year}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                      {entry.accepted_count}
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                      {entry.submitted_count}
                    </span>
                  </div>
                  <div className="col-span-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900 font-medium">{entry.task_completed_count}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Want to see your name on the leaderboard?</p>
          <a
            href="/auth/signup?role=student"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Join Now
          </a>
        </div>
      </div>
    </div>
  )
}
