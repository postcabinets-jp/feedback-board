import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: boards } = await supabase
    .from('boards')
    .select('id, name, slug')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, email, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex h-screen bg-neutral-50">
      <DashboardSidebar boards={boards ?? []} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader user={profile ?? { display_name: null, email: user.email ?? '', avatar_url: null }} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
