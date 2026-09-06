import { useGradeContext } from '../../contexts/GradeContext';
import Delete from '../common/Delete';
import AddItemButton from '../common/AddItemButton';

interface SidebarProps {
  currentPage: 'home' | 'about' | 'guide';
  onNavigateHome: () => void;
}

export default function Sidebar({ currentPage, onNavigateHome }: SidebarProps) {
  const { semesters, activeSemesterId, addSemester, removeSemester, setActiveSemester } = useGradeContext();

  const handleReturnToHome = () => {
    if (currentPage !== 'home') {
      onNavigateHome();
    }
  };

  const handleAddSemester = () => {
    addSemester();
    handleReturnToHome();
  };

  const handleSelectSemester = (semesterId: number) => {
    setActiveSemester(semesterId);
    handleReturnToHome();
  };

  return (
    <aside className="semester" id="semester">
      <h2 className="section-title">Semesters</h2>
      <div className="section-content">
        <div className="sidebar-list">
          {semesters.map(semester => (
            <div
              key={semester.id}
              onClick={() => handleSelectSemester(semester.id)}
              className={`sidebar-item${activeSemesterId === semester.id ? ' active' : ''}`}
            >
              <span className={`sidebar-name${activeSemesterId === semester.id ? ' active' : ''}`}>
                {semester.name}
              </span>
              <Delete 
                className="sidebar-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSemester(semester.id);
                }} 
                title="Delete Semester"
              />
            </div>
          ))}

          <AddItemButton
            label="Add Semester"
            onClick={handleAddSemester}
          />
        </div>
      </div>
    </aside>
  );
}
