type Page = 'home' | 'about' | 'guide'

interface HeaderProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="header" id="header">
      <div className="header-brand">
        <h1 className="header-title" onClick={() => onNavigate('home')}>
          JUNIOR
        </h1>
        <p className="header-subtitle">a grade calculator project by <strong>Rushi Parmar</strong> and <strong>Joshua Subray</strong>.</p>
      </div> 
      <nav className="navbar" id="navbar">
        <button
          className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
        <button
          className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
          onClick={() => onNavigate('about')}
        >
          About
        </button>
        <button
          className={`nav-link ${currentPage === 'guide' ? 'active' : ''}`}
          onClick={() => onNavigate('guide')}
        >
          Guide
        </button>
      </nav>
    </header>
  )
}
