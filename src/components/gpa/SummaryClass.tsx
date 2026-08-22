import type { Course } from '../../contexts/GradeContext';

function calculateClassAverage(course: Course): number {
  const categoryAverages = course.categories
    .filter((category) => category.items.length > 0)
    .map((category) => {
      const itemGrades = category.items.reduce((sum, item) => sum + item.grade, 0);
      return itemGrades / category.items.length;
    });

  if (categoryAverages.length === 0) return 0;

  return categoryAverages.reduce((sum, value) => sum + value, 0) / categoryAverages.length;
}

export default function SummaryClass({ course }: { course: Course }) {
  const average = calculateClassAverage(course);

  return (
    <div className="summary-stat summary-average">
      <span className="summary-label">Average</span>
      <strong className="summary-value">{average.toFixed(1)}%</strong>
    </div>
  );
}