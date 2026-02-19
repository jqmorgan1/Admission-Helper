import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('redirect') || '/student'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if profile exists, if not create it
        const { data: existingProfile } = await supabase
          .from('student_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (!existingProfile) {
          const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single()
          
          if (userData?.role === 'school') {
            await supabase.from('school_profiles').insert({
              user_id: user.id,
              school_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'School',
              contact_email: user.email,
            })
          } else {
            await supabase.from('student_profiles').insert({
              user_id: user.id,
              display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
              graduation_year: new Date().getFullYear() + 3,
              is_public: true,
              privacy_level: 'public',
            })
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
