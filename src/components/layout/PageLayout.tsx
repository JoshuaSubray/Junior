import { type ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import Ads from './Ads'
import { GradeProvider } from '../../contexts/GradeContext'
import './Layout.css'

type Page = 'home' | 'about' | 'guide'

interface PageLayoutProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  children: ReactNode
}

export default function PageLayout({ currentPage, onNavigate, children }: PageLayoutProps) {
  return (
    <GradeProvider>
      <div className="app-container">
        <Header currentPage={currentPage} onNavigate={onNavigate} />

        <div className="app-body">
          <Sidebar />

          <main className="main" id="main">
            {children}
          </main>

          <Ads />
        </div>

        <Footer />
      </div>
    </GradeProvider>
  )
}
