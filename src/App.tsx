import { useState, type ReactElement } from 'react'
import './App.css'
import PageLayout from './components/layout/PageLayout'
import Home from './pages/Home'
import About from './pages/About'
import Guide from './pages/Guide'

type Page = 'home' | 'about' | 'guide'

const pages: Record<Page, ReactElement> = {
  home: <Home />,
  about: <About />,
  guide: <Guide />,
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  return (
    <PageLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {pages[currentPage]}
    </PageLayout>
  )
}

export default App
