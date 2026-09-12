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

export class InvalidValueRangeError extends Error {
    constructor(message: string) {
        super(message);
        this.name="InvalidValueRangeError"
    }
}

export class InvalidGradeMappingError extends Error {
    constructor(message: string) {
        super(message);
        this.name="InvalidGradeMappingError";
    }
}
