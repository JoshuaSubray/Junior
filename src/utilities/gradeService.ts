import { type Course } from '../contexts/GradeContext'; 
import { GradeEntryAdapter } from '../adapters/gradeEntryAdapter';
import { gpaPresetMap, letterGradePresetMap } from './mappings/gradeMappingPresets';
import { GPACalculator } from './calculations/gpaCalculator';


/**
 * Simultaneously return course weighted average, GPA, and letter grade from a `Course` object.
 * @returns Grade, letter grade, and GPA or `null` entries when no average can be calculated.
 */
export function getCourseGradeData(course: Course) {
    const grade = GradeEntryAdapter.getCourseGrade(course);

    if (grade === null) {
        return {courseGrade: null, courseLetterGrade: null, courseGPA: null}
    }

    const roundedGrade = Math.round(grade);

    const courseGPA = gpaPresetMap.getStringValue(roundedGrade);
    const courseLetterGrade = letterGradePresetMap.getValue(roundedGrade);
    const courseGrade = grade.toFixed(2);

    return {courseGrade, courseLetterGrade, courseGPA}
}

/**
 * Get sessional GPA from a list of courses, utilizing the current GPA preset.
 * @returns Average GPA or `null` when no GPA can be calculated.
 */
export function getSessionalGPA(courses: Course[]): number | null {
    const averages = courses.map(course => GradeEntryAdapter.getCourseGrade(course)).filter((grade) => grade !== null); 
    if (averages.length === 0) return null;

    const gpaCalculator = new GPACalculator(gpaPresetMap);
    return gpaCalculator.getAverageGPA(averages);
}