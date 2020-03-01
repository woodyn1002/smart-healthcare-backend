export class InvalidPasswordError extends Error {
    constructor() {
        super('Invalid password.');
        this.name = 'InvalidPasswordError';
    }
}

export class UserNotFoundError extends Error {
    constructor(username) {
        super(`User ${username} was not found.`);
        this.name = 'UserNotFoundError';
    }
}

export class UsernameExistError extends Error {
    constructor(username) {
        super(`Username ${username} already exists.`);
        this.name = 'UsernameExistError';
    }
}

export class FoodNotFoundError extends Error {
    constructor(name) {
        super(`Food ${name} was not found.`);
        this.name = 'FoodNotFoundError';
    }
}

export class FoodExistError extends Error {
    constructor(name) {
        super(`Food ${name} already exists.`);
        this.name = 'FoodExistError';
    }
}

export class ExerciseNotFoundError extends Error {
    constructor(name) {
        super(`Exercise ${name} was not found.`);
        this.name = 'ExerciseNotFoundError';
    }
}

export class ExerciseExistError extends Error {
    constructor(name) {
        super(`Exercise ${name} already exists.`);
        this.name = 'ExerciseExistError';
    }
}

export class HealthDataNotFoundError extends Error {
    constructor(username) {
        super(`${username}'s health data was not found.`);
        this.name = 'HealthDataNotFoundError';
    }
}

export class HealthDataExistError extends Error {
    constructor(username) {
        super(`${username}'s health data already exists.`);
        this.name = 'HealthDataExistError';
    }
}

export class MealNotFoundError extends Error {
    constructor(username, date) {
        super(`${username}'s meal on ${date} was not found.`);
        this.name = 'MealNotFoundError';
    }
}

export class MealExistError extends Error {
    constructor(username, date) {
        super(`${username}'s meal on ${date} already exists.`);
        this.name = 'MealExistError';
    }
}

export class FitnessNotFoundError extends Error {
    constructor(username, date) {
        super(`${username}'s fitness on ${date} was not found.`);
        this.name = 'FitnessNotFoundError';
    }
}

export class FitnessExistError extends Error {
    constructor(username, date) {
        super(`${username}'s fitness on ${date} already exists.`);
        this.name = 'FitnessExistError';
    }
}