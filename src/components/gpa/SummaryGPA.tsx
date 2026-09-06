import type { Course } from '../../contexts/GradeContext';
import { GradeEntryAdapter } from '../../adapters/gradeEntryAdapter';

function calculateCourseGradeValue(course: Course): number {
  return GradeEntryAdapter.getCourseGrade(course) ?? 0;
}

export default function SummaryGPA({ courses }: { courses: Course[] }) {
  if (courses.length === 0) {
    return (
      <div className="summary-stat summary-gpa">
        <span className="summary-label">GPA</span>
        <strong className="summary-value">0.00</strong>
      </div>
    );
  }

  const average = courses.reduce((sum, course) => sum + calculateCourseGradeValue(course), 0) / courses.length;

  return (
    <div className="summary-stat summary-gpa">
      <span className="summary-label">GPA</span>
      <strong className="summary-value">{(average / 100).toFixed(2)}</strong>
    </div>
  );
}