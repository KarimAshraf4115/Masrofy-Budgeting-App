import './globals.css'
import AppShell from '@/components/AppShell'

export const metadata = {
  title: 'Masroofy',
  description: 'Budget Tracker',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-on-background font-body-lg antialiased">
        
        {/* Font and Icon links */}
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

        {/* The Smart App Shell (Sidebar + Top Nav) */}
        <AppShell>
          {children}
        </AppShell>

      </body>
    </html>
  )
}