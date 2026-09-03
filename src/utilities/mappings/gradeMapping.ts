import { InvalidGradeMappingError } from "./mappingerrors";
import { RangeMapping } from "./rangeMapping";


/**
 * Represents the mapping of percentages within a grading system.
 * 
 * Invariants:
 * 
 * 1) Every range in the collection must have a lower bound of at least 0, and an upper bound of at most 100.
 * 2) Every range in the collection must be contiguous. That is, all numbers from 0-100 must have a valid mapping.
 * 
 * @example
 * // Assume we defined a RangeMapping called <mapping> for the following ranges:
 * // 0-49 -> "F", 
 * // 50-59 -> "D", 
 * // 60-69 -> "C", 
 * // 70-79 -> "B", 
 * // 80-100 -> "A"
 * 
 * // The ranges cover 0-100 continuously, so this is valid.
 * const gradeMapping = new GradeMapping<string>(mapping);
 * 
 * // Now assume we redefine <mapping> for the following ranges:
 * // 0-49 -> "F", 
 * // 60-69 -> "C", 
 * // 70-79 -> "B", 
 * // 80-100 -> "A"
 * 
 * // Throws InvalidGradeMappingError. 
 * const invalidGradeMapping = new GradeMapping<string>(mapping); 
 * 
 * // There is no defined range for 50-59, which breaks the second invariant.
 * 
 */
class GradeMapping<T> {
    private gradeMap: RangeMapping<T>;

    constructor(gradeMap: RangeMapping<T>) {
        this.gradeMap = gradeMap;

        if (!this.isComplete()) {
            throw new InvalidGradeMappingError("List of ranges do not sit within 0-100%.");
        }
        if (!this.isContiguous()) {
            throw new InvalidGradeMappingError("List of ranges are not contiguous.")
        }
    }

    /**
     * Returns the value mapped to the range that contains `average`. 
     * If `average` is below 0, it will be clamped to 0.
     * If `average` is above 100, it will be clamped to 100.
     * 
     * @param average The number to map
     * @returns The mapped value
     * @throws `MappingNotFoundError` if there does not exist a range containing the clamped average.
     * @example 
     * // Assume we defined a RangeMapping called <mapping> for the following ranges:
     * // 0-49 -> "F", 
     * // 50-59 -> "D", 
     * // 60-69 -> "C", 
     * // 70-79 -> "B", 
     * // 80-100 -> "A"
     * 
     * const gradeMapping = new GradeMapping<string>(mapping);
     * 
     * gradeMapping.getValue(40);  // Output: "F"
     * gradeMapping.getValue(67);  // Output: "C"
     * gradeMapping.getValue(500); // Output: "A"
     * gradeMapping.getValue(-50); // Output: "F"
     */
    public getValue(average: number): T {
        const clampedAverage = Math.max(0, Math.min(100, average));
        return this.gradeMap.getValue(clampedAverage);
    }

    private isComplete() {
        const ranges = this.gradeMap.getRanges();
        return ranges[0].lowerBound === 0 && ranges[ranges.length - 1].upperBound === 100;
    }

    private isContiguous(): boolean {
        return this.gradeMap.getRanges().every((_, index, ranges) => {
            const next = index + 1;

            if (next === ranges.length) {
                return true;
            }

            return (ranges[index].upperBound + 1 === ranges[next].lowerBound)
        })
    }
}

/**
 * Represents a mapping of average percentages to GPA points in a grading system.
 */
export class GPAMap extends GradeMapping<number> {
    public getStringValue(average: number): string {
        const gpa = super.getValue(average);
        return gpa.toFixed(1);
    }
}

/**
 * Represents a mapping of average percentages to letter grades in a grading system.
 */
export class LetterGradeMap extends GradeMapping<string> {}
