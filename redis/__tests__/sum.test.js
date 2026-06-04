import { sum } from '../utils/utils.js';

describe('sum', () => {
    test('should return the sum of two numbers', () => {
        const result = sum(1, 2)
        expect(result).toBe(3);
    });

    test('should return the sum of two negative numbers', () => {
        const result = sum(-1, -2)
        expect(result).toBe(-3);
    });

    test('should return the sum of a positive and a negative number', () => {
        const result = sum(1, -2)
        expect(result).toBe(-1);
    });
})