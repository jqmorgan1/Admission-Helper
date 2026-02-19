import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const origin = searchParams.get('origin') || '/'

  const supabase = await createClient()
  
  await supabase.auth.signOut()

  return redirect(origin)
}
