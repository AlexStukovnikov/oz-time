import { isFixedUnit, unitToMilliseconds, normalizeUnit } from '../utils/units.js';

function assertAmount(amount) {
    if (typeof amount !== 'number' || Number.isNaN(amount)) {
        throw new TypeError('amount must be a valid number');
    }
}

export class Duration {
    constructor(milliseconds) {
        if (typeof milliseconds !== 'number' || Number.isNaN(milliseconds)) {
            throw new TypeError('Duration: milliseconds must be a valid number');
        }

        this._milliseconds = milliseconds;
    }

    toMilliseconds() {
        return this._milliseconds;
    }

    asMilliseconds() {
        return this._milliseconds;
    }

    asSeconds() {
        return this._milliseconds / unitToMilliseconds('second');
    }

    asMinutes() {
        return this._milliseconds / unitToMilliseconds('minute');
    }

    asHours() {
        return this._milliseconds / unitToMilliseconds('hour');
    }

    asDays() {
        return this._milliseconds / unitToMilliseconds('day');
    }

    add(other) {
        if (!(other instanceof Duration)) {
            throw new TypeError('Duration.add: other must be Duration');
        }

        return new Duration(this._milliseconds + other._milliseconds);
    }
}

export function duration(amount, unit) {
    assertAmount(amount);

    const normalizedUnit = normalizeUnit(unit);

    if (!isFixedUnit(normalizedUnit)) {
        throw new Error(`duration supports only fixed units: ${unit}`);
    }

    return new Duration(amount * unitToMilliseconds(normalizedUnit));
}
