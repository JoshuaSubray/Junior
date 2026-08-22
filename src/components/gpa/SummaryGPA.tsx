import type { Course } from '../../contexts/GradeContext';

function calculateCourseGradeValue(course: Course): number {
  let totalPoints = 0;
  let totalWeight = 0;

  course.categories.forEach((category) => {
    if (category.items.length === 0) return;

    const categoryWeight = category.totalWeight || 0;
    const autoWeight = categoryWeight / category.items.length;

    category.items.forEach((item) => {
      const effectiveWeight = item.weightOverride ?? autoWeight;
      totalPoints += (item.grade / 100) * effectiveWeight;
      totalPoints += item.gradeExtra ?? 0;
      totalWeight += effectiveWeight;
    });
  });

  return totalWeight > 0 ? (totalPoints / totalWeight) * 100 : 0;
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