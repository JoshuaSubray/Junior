import { useGradeContext } from '../contexts/GradeContext';
import Entries from '../components/gpa/Entries';
import SummaryGPA from '../components/gpa/SummaryGPA';

export default function Home() {
  const { semesters, activeSemesterId } = useGradeContext();
  const activeSemester = semesters.find((s) => s.id === activeSemesterId);
  const courses = activeSemester?.courses ?? [];

  return (
    <div className="home-page">
      {activeSemester && (
        <div className="semester-summary-banner">
          <div className="semester-summary-info">
            <h2 className="semester-summary-title">{activeSemester.name || 'Untitled Semester'}</h2>
            <span className="semester-summary-subtitle">
              {courses.length} {courses.length === 1 ? 'Class' : 'Classes'}
            </span>
          </div>

          <div className="semester-summary-stats">
            <SummaryGPA courses={courses} />
          </div>
        </div>
      )}

      <h2 className="section-title">Classes</h2>
      <div className="section-content">
        <Entries />
      </div>
    </div>
  );
}
