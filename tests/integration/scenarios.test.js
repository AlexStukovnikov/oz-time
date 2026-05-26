import { describe, it, expect } from 'vitest';
import { fromISO, fromComponents, interval, duration } from '../../src/index.js';

describe('Integration Scenarios', () => {
    it('Scenario 1: Cross-timezone flight calculation', () => {
        const departureTokyo = fromComponents(2026, 5, 24, 1, 0, 0, 0, 'Asia/Tokyo');

        const flightTime = duration(11.5, 'hour');

        const arrivalNY = departureTokyo.add(flightTime.asMinutes(), 'minute').setTimezone('America/New_York');

        expect(arrivalNY.format('YYYY-MM-DD HH:mm')).toBe('2026-05-24 08:30');
    });

    it('Scenario 2: Meeting room booking system', () => {
        const meetingStart = fromISO('2026-06-10T09:00:00Z');
        const meetingDuration = duration(90, 'minute');

        const meetingEnd = meetingStart.add(meetingDuration.asMinutes(), 'minute');
        const bookedSlot = interval(meetingStart, meetingEnd);

        const newRequestStart = fromISO('2026-06-10T10:00:00Z');
        const newRequestEnd = fromISO('2026-06-10T11:00:00Z');
        const newRequestSlot = interval(newRequestStart, newRequestEnd);

        expect(bookedSlot.overlaps(newRequestSlot)).toBe(true);

        const checkTime = fromISO('2026-06-10T10:45:00Z');
        expect(bookedSlot.contains(checkTime)).toBe(false);
    });

    it('Scenario 3: Complex fluent API chain', () => {
        const result = fromISO('2026-01-01T00:00:00Z').add(1, 'month').subtract(1, 'day').setTimezone('Europe/Moscow').format('DD.MM.YYYY HH:mm', 'ru-RU');

        expect(result).toBe('31.01.2026 03:00');
    });

    it('Scenario 4: Subscription expiration and SLA', () => {
        const subscriptionStart = fromISO('2026-01-15T12:00:00Z');
        const subscriptionEnd = subscriptionStart.add(1, 'year');

        const cancelTime = subscriptionEnd.subtract(3, 'day');

        expect(cancelTime.toISOString()).toBe('2027-01-12T12:00:00.000Z');

        expect(subscriptionEnd.diff(cancelTime, 'day')).toBe(3);

        const slaDuration = duration(48, 'hour');
        const deadline = cancelTime.add(slaDuration.asHours(), 'hour');

        expect(deadline.toISOString()).toBe('2027-01-14T12:00:00.000Z');
    });
});
