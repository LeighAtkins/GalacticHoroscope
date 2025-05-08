import { determineZodiacSign, isValidDate, zodiacSigns } from '../src/zodiac';

describe('Zodiac Sign Detection', () => {
  test('should correctly identify Aries for March 25', () => {
    const sign = determineZodiacSign(3, 25);
    expect(sign).not.toBeNull();
    expect(sign?.name).toBe('Aries');
  });

  test('should correctly identify Capricorn for December 25', () => {
    const sign = determineZodiacSign(12, 25);
    expect(sign).not.toBeNull();
    expect(sign?.name).toBe('Capricorn');
  });

  test('should correctly identify Capricorn for January 10', () => {
    const sign = determineZodiacSign(1, 10);
    expect(sign).not.toBeNull();
    expect(sign?.name).toBe('Capricorn');
  });

  test('should correctly identify all zodiac signs', () => {
    // Test the edge cases for each zodiac sign
    const testCases = [
      { month: 1, day: 20, expected: 'Aquarius' },
      { month: 2, day: 19, expected: 'Pisces' },
      { month: 3, day: 21, expected: 'Aries' },
      { month: 4, day: 20, expected: 'Taurus' },
      { month: 5, day: 21, expected: 'Gemini' },
      { month: 6, day: 21, expected: 'Cancer' },
      { month: 7, day: 23, expected: 'Leo' },
      { month: 8, day: 23, expected: 'Virgo' },
      { month: 9, day: 23, expected: 'Libra' },
      { month: 10, day: 23, expected: 'Scorpio' },
      { month: 11, day: 22, expected: 'Sagittarius' },
      { month: 12, day: 22, expected: 'Capricorn' },
    ];

    testCases.forEach(({ month, day, expected }) => {
      const sign = determineZodiacSign(month, day);
      expect(sign).not.toBeNull();
      expect(sign?.name).toBe(expected);
    });
  });
});

describe('Date Validation', () => {
  test('should validate correct dates', () => {
    expect(isValidDate(1, 31)).toBe(true);
    expect(isValidDate(2, 29)).toBe(true); // Leap year case
    expect(isValidDate(4, 30)).toBe(true);
  });

  test('should invalidate incorrect dates', () => {
    expect(isValidDate(0, 15)).toBe(false); // Invalid month
    expect(isValidDate(13, 1)).toBe(false); // Invalid month
    expect(isValidDate(2, 30)).toBe(false); // Invalid day for February
    expect(isValidDate(6, 31)).toBe(false); // June has 30 days
  });
});

describe('Zodiac Sign Data Structure', () => {
  test('should have 12 zodiac signs', () => {
    expect(zodiacSigns.length).toBe(12);
  });

  test('each zodiac sign should have required properties', () => {
    zodiacSigns.forEach(sign => {
      expect(sign).toHaveProperty('name');
      expect(sign).toHaveProperty('symbol');
      expect(sign).toHaveProperty('start');
      expect(sign).toHaveProperty('end');
      expect(sign.start).toHaveProperty('month');
      expect(sign.start).toHaveProperty('day');
      expect(sign.end).toHaveProperty('month');
      expect(sign.end).toHaveProperty('day');
    });
  });
}); 