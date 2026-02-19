'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Mail, Lock, User, Building2, ArrowRight } from 'lucide-react'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'student' | 'school'>(
    (searchParams.get('role') as 'student' | 'school') || 'student'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = role === 'student' ? '/student' : '/school'

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Sign up
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      })

      if (signupError) {
        setError(signupError.message)
        return
      }

      if (data.user) {
        // Create profile
        if (role === 'student') {
          await supabase.from('student_profiles').insert({
            user_id: data.user.id,
            display_name: fullName,
            graduation_year: new Date().getFullYear() + 3, // Default to 3 years from now
            is_public: true,
            privacy_level: 'public',
          })
        } else {
          await supabase.from('school_profiles').insert({
            user_id: data.user.id,
            school_name: fullName,
            contact_email: email,
            subscription_tier: 'free',
          })
        }

        router.push(redirectTo)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-gray-600">Start your college journey today</p>
      </div>

      {/* Role Selection */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setRole('student')}
          className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-colors ${
            role === 'student'
              ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <User className="h-5 w-5" />
          Student
        </button>
        <button
          type="button"
          onClick={() => setRole('school')}
          className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-colors ${
            role === 'school'
              ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <Building2 className="h-5 w-5" />
          School
        </button>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSignup}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="sr-only">
              {role === 'student' ? 'Your Name' : 'School Name'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={role === 'student' ? 'Your Name' : 'School Name'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : `Create ${role} account`}
          </button>
        </div>

        <p className="text-xs text-center text-gray-500">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          href="/auth/login"
          className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center justify-center gap-1"
        >
          Sign in <ArrowRight className="h-4 w-4" />
        </Link>
      </p>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Loading...</h2>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<LoadingFallback />}>
        <SignupForm />
      </Suspense>
    </div>
  )
}
