export function isLeapYear(year) {
    if (year % 400 === 0) return true;
    if (year % 100 === 0) return false;
    return year % 4 === 0;
}

export function daysInMonth(year, month) {
    const thirtyOne = [1, 3, 5, 7, 8, 10, 12];
    if (month === 2) {
        return isLeapYear(year) ? 29 : 28;
    }
    if (thirtyOne.includes(month)) return 31;
    return 30;
}

const MS_SECOND = 1000;
const MS_MINUTE = MS_SECOND * 60;
const MS_HOUR = MS_MINUTE * 60;
const MS_DAY = MS_HOUR * 24;

export function addByFixedUnit(timestamp, amount, unit) {
    switch (unit) {
        case 'millisecond':
        case 'ms':
            return timestamp + amount;
        case 'second':
        case 's':
            return timestamp + amount * MS_SECOND;
        case 'minute':
        case 'm':
            return timestamp + amount * MS_MINUTE;
        case 'hour':
        case 'h':
            return timestamp + amount * MS_HOUR;
        case 'day':
        case 'd':
            return timestamp + amount * MS_DAY;
        default:
            throw new Error(`Unsupported fixed unit: ${unit}`);
    }
}
