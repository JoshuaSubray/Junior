
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
 * Invariant: Overlapping ranges not allowed and ranges are automatically sorted by lower bound.
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

    public getValue(input: number): T {
        for (const {lowerBound, upperBound, value} of this.ranges) {
            if (this.inBetween(lowerBound, upperBound, input)) {
                return value;
            }
        }

        throw new MappingNotFoundError(`No valid mapping for input: ${input}`);
    }

    public getRanges(): ValueRange<T>[] {
        return [...this.ranges];
    }
}


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

    public getValue(average: number): T {
        return this.gradeMap.getValue(average);
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

export class GPAMap extends GradeMapping<number> {
    public getStringValue(average: number): string {
        const gpa = super.getValue(average);
        return gpa.toFixed(1);
    }
}

export class LetterGradeMap extends GradeMapping<string> {}
