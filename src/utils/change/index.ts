import type {
  MachineMoney,
  ChangeResult,
  CoinDenomination,
  BanknoteDenomination,
} from '@/types/money';

type Denomination =
  | { type: 'coins'; value: CoinDenomination }
  | { type: 'banknotes'; value: BanknoteDenomination };

function roundTo2(num: number) {
  return Math.round(num * 100) / 100;
}

export function calculateChange(
  amount: number,
  machineMoney: MachineMoney,
  coins: readonly CoinDenomination[],
  banknotes: readonly BanknoteDenomination[],
): ChangeResult | null {
  let remaining = roundTo2(amount);
  const change: ChangeResult = {};

  const allDenominations: Denomination[] = [
    ...banknotes.map((b) => ({ type: 'banknotes' as const, value: b })),
    ...coins.map((c) => ({ type: 'coins' as const, value: c })),
  ].sort((a, b) => b.value - a.value);

  for (const denom of allDenominations) {
    if (denom.type === 'banknotes') {
      const available = machineMoney.banknotes[denom.value];

      if (available <= 0) continue;

      const needed = Math.floor(remaining / denom.value);
      const toUse = Math.min(needed, available);

      if (toUse > 0) {
        change.banknotes ??= {};
        change.banknotes[denom.value] = toUse;

        remaining = roundTo2(remaining - toUse * denom.value);
      }
    }

    if (denom.type === 'coins') {
      const available = machineMoney.coins[denom.value];

      if (available <= 0) continue;

      const needed = Math.floor(remaining / denom.value);
      const toUse = Math.min(needed, available);

      if (toUse > 0) {
        change.coins ??= {};
        change.coins[denom.value] = toUse;

        remaining = roundTo2(remaining - toUse * denom.value);
      }
    }
  }

  if (remaining > 0.01) return null;

  return change;
}

export function formatChange(change: ChangeResult): string {
  const parts: string[] = [];

  if (change.banknotes) {
    const sortedBanknotes = Object.entries(change.banknotes).sort(
      ([a], [b]) => Number(b) - Number(a),
    );

    for (const [value, count] of sortedBanknotes) {
      parts.push(`${count}x ${value}฿`);
    }
  }

  if (change.coins) {
    const sortedCoins = Object.entries(change.coins).sort(
      ([a], [b]) => Number(b) - Number(a),
    );

    for (const [value, count] of sortedCoins) {
      parts.push(`${count}x ${value}฿`);
    }
  }

  return parts.join(', ') || '0฿';
}
