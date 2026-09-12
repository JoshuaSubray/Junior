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
          JUNIOR: GRADE CALCULATOR
        </h1>
        <p className="header-subtitle">Project JR By:</p>
        <p className="header-subtitle">
          <a href="https://www.linkedin.com/in/joshuasubray/" target="_blank" rel="noreferrer">
            <strong>Joshua Subray</strong>
          </a>{' '}(The <strong>J</strong> in <strong>J</strong>R)
        </p>
        <p className="header-subtitle">
          <a href="https://www.linkedin.com/in/rushi-parmar2005/" target="_blank" rel="noreferrer">
            <strong>Rushi Parmar</strong>
          </a>{' '}(The <strong>R</strong> in J<strong>R</strong>)
        </p>
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
