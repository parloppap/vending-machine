import { calculateChange, formatChange } from '@/utils/change';
import type { MachineMoney, ChangeResult } from '@/types';

describe('calculateChange', () => {
  const COINS = [1, 5, 10] as const;
  const BANKNOTES = [20, 50, 100, 500, 1000] as const;

  const mockMachineMoney: MachineMoney = {
    coins: { 1: 10, 5: 10, 10: 10 },
    banknotes: { 20: 5, 50: 5, 100: 5, 500: 2, 1000: 1 },
  };

  test('should calculate exact change with mixed denominations', () => {
    const result = calculateChange(77, mockMachineMoney, COINS, BANKNOTES);

    expect(result).not.toBeNull();
    expect(result?.banknotes?.[50]).toBe(1);
    expect(result?.banknotes?.[20]).toBe(1);
    expect(result?.coins?.[5]).toBe(1);
    expect(result?.coins?.[1]).toBe(2);
  });

  test('should return null when exact change cannot be made', () => {
    const limitedMoney: MachineMoney = {
      coins: { 1: 0, 5: 0, 10: 1 },
      banknotes: { 20: 0, 50: 0, 100: 0, 500: 0, 1000: 0 },
    };

    const result = calculateChange(7, limitedMoney, COINS, BANKNOTES);
    expect(result).toBeNull();
  });

  test('should handle zero change', () => {
    const result = calculateChange(0, mockMachineMoney, COINS, BANKNOTES);

    expect(result).not.toBeNull();
    expect(result).toEqual({});
  });

  test('should prioritize larger denominations', () => {
    const result = calculateChange(100, mockMachineMoney, COINS, BANKNOTES);

    expect(result?.banknotes?.[100]).toBe(1);
    expect(result?.banknotes?.[50]).toBeUndefined();
  });

  test('should handle decimal amounts correctly', () => {
    const result = calculateChange(7, mockMachineMoney, COINS, BANKNOTES);

    expect(result).not.toBeNull();
    expect(result?.coins?.[5]).toBe(1);
    expect(result?.coins?.[1]).toBe(2);
  });

  test('should return null when machine runs out of specific denomination', () => {
    const emptyCoins: MachineMoney = {
      coins: { 1: 0, 5: 0, 10: 0 },
      banknotes: { 20: 5, 50: 5, 100: 5, 500: 2, 1000: 1 },
    };

    const result = calculateChange(15, emptyCoins, COINS, BANKNOTES);
    expect(result).toBeNull();
  });

  test('should handle large amounts', () => {
    const result = calculateChange(1570, mockMachineMoney, COINS, BANKNOTES);

    expect(result).not.toBeNull();
    expect(result?.banknotes?.[1000]).toBe(1);
    expect(result?.banknotes?.[500]).toBe(1);
    expect(result?.banknotes?.[50]).toBe(1);
    expect(result?.banknotes?.[20]).toBe(1);
  });

  test('should use minimum coins/notes', () => {
    const result = calculateChange(30, mockMachineMoney, COINS, BANKNOTES);

    expect(result).not.toBeNull();
    expect(result?.banknotes?.[20]).toBe(1);
    expect(result?.coins?.[10]).toBe(1);
  });

  test('should handle change requiring 1 baht coins', () => {
    const result = calculateChange(13, mockMachineMoney, COINS, BANKNOTES);

    expect(result).not.toBeNull();
    expect(result?.coins?.[10]).toBe(1);
    expect(result?.coins?.[1]).toBe(3);
  });

  test('should handle change with 5 and 1 baht coins', () => {
    const result = calculateChange(8, mockMachineMoney, COINS, BANKNOTES);

    expect(result).not.toBeNull();
    expect(result?.coins?.[5]).toBe(1);
    expect(result?.coins?.[1]).toBe(3);
  });
});

describe('formatChange', () => {
  test('should format change with banknotes only', () => {
    const change: ChangeResult = {
      banknotes: { 100: 1, 50: 1 },
    };

    const formatted = formatChange(change);
    expect(formatted).toContain('1x 100฿');
    expect(formatted).toContain('1x 50฿');
  });

  test('should format change with coins only', () => {
    const change: ChangeResult = {
      coins: { 10: 2, 5: 1, 1: 3 },
    };

    const formatted = formatChange(change);
    expect(formatted).toContain('2x 10฿');
    expect(formatted).toContain('1x 5฿');
    expect(formatted).toContain('3x 1฿');
  });

  test('should format change with mixed denominations', () => {
    const change: ChangeResult = {
      banknotes: { 50: 1 },
      coins: { 5: 1, 1: 2 },
    };

    const formatted = formatChange(change);
    expect(formatted).toContain('1x 50฿');
    expect(formatted).toContain('1x 5฿');
    expect(formatted).toContain('2x 1฿');
  });

  test('should return 0฿ for empty change', () => {
    expect(formatChange({})).toBe('0฿');
  });

  test('should format single coin', () => {
    const change: ChangeResult = {
      coins: { 10: 1 },
    };

    expect(formatChange(change)).toBe('1x 10฿');
  });

  test('should format multiple same denomination', () => {
    const change: ChangeResult = {
      banknotes: { 20: 5 },
    };

    expect(formatChange(change)).toBe('5x 20฿');
  });

  test('should format multiple 1 baht coins', () => {
    const change: ChangeResult = {
      coins: { 1: 7 },
    };

    expect(formatChange(change)).toBe('7x 1฿');
  });
});
