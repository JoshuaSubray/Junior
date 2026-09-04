import type { Course } from '../../contexts/GradeContext';

function calculateClassAverage(course: Course): number {
  const categoryAverages = course.categories
    .filter((category) => category.items.some((item) => item.grade !== null))
    .map((category) => {
      const completedItems = category.items.filter((item) => item.grade !== null);
      const itemGrades = completedItems.reduce((sum, item) => sum + (item.grade ?? 0), 0);
      return itemGrades / completedItems.length;
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