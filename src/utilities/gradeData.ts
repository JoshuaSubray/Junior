import { type Course } from '../contexts/GradeContext'; 
import { GradeEntryAdapter } from '../adapters/gradeEntryAdapter';
import { gpaPresetMap, letterGradePresetMap } from './mappings/gradeMappingPresets';
import { GPACalculator } from './calculations/gpaCalculator';


/**
 * Helper function to simultaneously return course weighted average, GPA, and letter grade from a `Course` object.
 * Returns "—" when no average can be calculated.
 */
export function getCourseGradeData(course: Course) {
    const grade = GradeEntryAdapter.getCourseGrade(course);

    if (grade === null) {
        return {courseGrade: "—", courseLetterGrade: "—", courseGPA: "—"}
    }

    const courseGPA = gpaPresetMap.getStringValue(grade);
    const courseLetterGrade = letterGradePresetMap.getValue(grade);

    const courseGrade = grade.toFixed(2);

    return {courseGrade, courseLetterGrade, courseGPA}
}

/**
 * Helper function to return sessional GPA from a list of courses, utilizing the current GPA preset.
 * Returns "—" when no GPA can be calculated.
 */
export function getSessionalGPA(courses: Course[]) {
    const gpa = new GPACalculator(gpaPresetMap).getSessionalGPA(courses);

    if (gpa === null) {
        return "—"
    }

    return gpa.toFixed(2);
}