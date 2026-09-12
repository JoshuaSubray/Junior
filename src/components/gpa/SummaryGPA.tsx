import type { Course } from '../../contexts/GradeContext';
import { getSessionalGPA } from '../../utilities/gradeService';

export default function SummaryGPA({ courses }: { courses: Course[] }) {
  const sessionalGPA = getSessionalGPA(courses);

  return (
    <div className="summary-stat summary-gpa">
      <span className="summary-label">GPA</span>
      <strong className="summary-value">{sessionalGPA !== null ? sessionalGPA.toFixed(2) : "—"}</strong>
    </div>
  );
}