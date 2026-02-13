import type { MachineMoney } from '@/types/money';

export const INITIAL_MACHINE_MONEY: MachineMoney = {
  coins: { 1: 20, 5: 20, 10: 30 },
  banknotes: { 20: 10, 50: 10, 100: 5, 500: 3, 1000: 2 },
};
