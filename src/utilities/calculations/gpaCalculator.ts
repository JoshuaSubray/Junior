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

    public getAverageGPA(percentages: number[]): number | null {
        const len = percentages.length;
        if (len === 0) {
            return null;
        }

        return percentages.reduce((accumulator, current) => accumulator + this.getGPAFromPercentage(current), 0) / len;
    }
}