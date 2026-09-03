/**
 * Defines a value of type `T` that is mapped to an inclusive range of numbers from `lowerBound` to `upperBound`.
 * 
 * @example
 * 
 * { lowerBound: 0, upperBound: 50, value: "A+" }  // Simply put: 0-50 -> "A+"
 * 
 * The lower bound is 0, the upper bound is 50, and they map to the string "A+".
 * 
 * 30 falls within the defined range, therefore it maps to "A+".
 * 
 * 70 is not within the defined range, so it does not map to "A+".
 */
interface ValueRange<T> {
    upperBound: number;
    lowerBound: number;
    value: T;
}

class MappingNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MappingNotFoundError";
    }
}

class OverlappingRangeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "OverlappingRangeError";
    }
}

class InvalidGradeMappingError extends Error {
    constructor(message: string) {
        super(message);
        this.name="InvalidGradeMappingError";
    }
}

/**
 * Represents a collection of ranges that map to values of type `T`.
 * 
 * Invariants:
 * 1) Ranges may not overlap.
 * 2) The collection of range definitions is sorted by `lowerBound`.
 * 
 * @example
 * A valid collection of ranges:
 * 
 * // 0-49 -> "F"
 * const fRange: ValueRange<string> = {
 *     lowerBound: 0,
 *     upperBound: 49,
 *     value: "F"
 * };
 * 
 * // 61-100 -> "A"
 * const aRange: ValueRange<string> = {
 *     lowerBound: 61,
 *     upperBound: 100,
 *     value: "A"
 * };
 * 
 * // Creating a collection that contains fRange and aRange.
 * const mapping = new RangeMapping<string>();
 * mapping.addRange(fRange); // 0-49 -> "F"
 * mapping.addRange(aRange); // 61-100 -> "A"
 * 
 * // Adding an invalid range:
 * 
 * // 20-100 -> "A"
 * const overlappingRange: ValueRange<string> = {
 *     lowerBound: 20,
 *     upperBound: 100,
 *     value: "A"
 * };
 * 
 * mapping.addRange(overlappingRange); // Throws error
 * 
 * // For example, 30 falls within the range 0-49, but it also falls within the range 20-100. 
 * // It is not clear if 30 maps to "F" or if it maps to "A".
 */
export class RangeMapping<T> {
    private ranges: ValueRange<T>[];

    constructor() {
        this.ranges = [];
    }

    private inBetween(lower:number, upper:number, value: number) {
        return (lower <= value && value <= upper);
    }

    private getOverlap(newRange: ValueRange<T>): ValueRange<T> | null {
        const { upperBound: newUpper, lowerBound: newLower } = newRange;
        for (const range of this.ranges) {
            const {lowerBound, upperBound} = range;
            if (newUpper >= lowerBound && newLower <= upperBound) {
                return range;
            }
        }
        return null;
    }

    /**
     * Adds a new range definition to the collection. 
     * 
     * @param newRange The new range definition to be added.
     * @throws `OverlappingRangeError` if the new range definition causes overlapping within the existing collection.
     */
    public addRange(newRange: ValueRange<T>) {
        const { upperBound: newUpper, lowerBound: newLower } = newRange;

        // Trivial push
        if (this.ranges.length === 0) {
            this.ranges.push(newRange);
            return;
        }
        
        // Overlap check
        const overlap = this.getOverlap(newRange);
        if (overlap !== null) {
            throw new OverlappingRangeError(`New range with bounds ${newLower}-${newUpper} overlaps with an existing range with bounds ${overlap.lowerBound}-${overlap.upperBound}.`);
        }
        // Sorted insertion
        else{ 
            const index = this.ranges.findIndex(range => range.lowerBound > newLower);
            const insert = (index === -1) ? this.ranges.length : index;

            this.ranges.splice(insert, 0, newRange);
        }
    }

    /**
     * Returns the value mapped to the range that contains `input`.
     * 
     * @param input The number to map
     * @returns The mapped value
     * @throws `MappingNotFoundError` if there does not exist a range that includes `input`.
     * @example
     * // 0-49 -> "F"
     * const fRange: ValueRange<string> = {
     *     lowerBound: 0,
     *     upperBound: 49,
     *     value: "F"
     * };
     * 
     * // 61-100 -> "A"
     * const aRange: ValueRange<string> = {
     *     lowerBound: 61,
     *     upperBound: 100,
     *     value: "A"
     * };
     * 
     * // Creating a collection that contains fRange and aRange.
     * const mapping = new RangeMapping<string>();
     * mapping.addRange(fRange); // 0-49 -> "F"
     * mapping.addRange(aRange); // 61-100 -> "A"
     * 
     * mapping.getValue(30);  // Output: "F" because 30 is within 0-49 which maps to "F".
     * mapping.getValue(90);  // Output: "A" because 90 is within 61-100 which maps to "A".
     * mapping.getValue(999); // Output: MappingNotFoundError because 999 is not within any defined range in the collection.
     * 
     */
    public getValue(input: number): T {
        for (const {lowerBound, upperBound, value} of this.ranges) {
            if (this.inBetween(lowerBound, upperBound, input)) {
                return value;
            }
        }

        throw new MappingNotFoundError(`No valid mapping for input: ${input}`);
    }

    /**
     * Returns a copy of the ranges in sorted order.
     * 
     * @returns A copy of the ranges in sorted order.
     * @example
     *
     * // 61-100 -> "A"
     * const aRange: ValueRange<string> = {
     *     lowerBound: 61,
     *     upperBound: 100,
     *     value: "A"
     * };
     * 
     * // 0-49 -> "F"
     * const fRange: ValueRange<string> = {
     *     lowerBound: 0,
     *     upperBound: 49,
     *     value: "F"
     * };
     * 
     * const mapping = new RangeMapping<string>();
     * 
     * mapping.addRange(aRange); // 61-100 -> "A"
     * 
     * mapping.addRange(fRange); // 0-49 -> "F"
     * 
     * mapping.getRanges(); 
     * // Returns:
     * [
     *     {lowerBound: 0, upperBound: 49, value: "F"},
     *     {lowerBound: 61, upperBound: 100, value: "A"}
     * ]
     * 
     */
    public getRanges(): ValueRange<T>[] {
        return [...this.ranges];
    }
}

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
