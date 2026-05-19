import AdminSidebar from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  )
}
