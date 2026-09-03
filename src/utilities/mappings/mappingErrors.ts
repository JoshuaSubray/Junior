export class MappingNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MappingNotFoundError";
    }
}

export class OverlappingRangeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "OverlappingRangeError";
    }
}

export class InvalidGradeMappingError extends Error {
    constructor(message: string) {
        super(message);
        this.name="InvalidGradeMappingError";
    }
}
