import { GradeEntryAdapter } from "../../adapters/gradeEntryAdapter";
import { type Semester, type Course } from "../../contexts/GradeContext";
import { GPAMap } from "../mappings/gradeMapping";

/**
 * Performs GPA related aggregation and average percentage mapping.
 * 
 * The calculator requires a `GPAMap` configuration. 
 * 
 * Note: Aggregation functions do not yet incorporate credit-weighted averaging.
 */
export class GPACalculator {
    private gpaMap: GPAMap;

    constructor(gpaMap: GPAMap) {
        this.gpaMap = gpaMap;
    }

    public getGPAFromPercentage(percentage: number): number {
        return this.gpaMap.getValue(Math.round(percentage));
    }

    public getStringGPAFromPercentage(percentage: number): string {
        return this.gpaMap.getStringValue(Math.round(percentage));
    }

    public getSessionalGPA(courses: Course[]): number | null {
        const averages = courses.map(course => GradeEntryAdapter.getCourseGrade(course)).filter((grade) => grade !== null);

        if (averages.length === 0) return null;

        const sessionalGPA = averages.reduce((accumulator, current) => accumulator + this.getGPAFromPercentage(current), 0) / averages.length;

        return sessionalGPA;
    }

    public getCGPA(semesters: Semester[]): number | null {
        const semesterGPAs = semesters.map(semester => this.getSessionalGPA(semester.courses)).filter(semester => semester !== null);

        if (semesterGPAs.length === 0) return null;
        
        const CGPA = semesterGPAs.reduce((accumulator, current) => accumulator + current, 0) / semesterGPAs.length;

        return CGPA;

    }
}