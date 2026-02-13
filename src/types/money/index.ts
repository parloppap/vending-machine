import { BANKNOTES, COINS } from '@/constant';

export type CoinDenomination = (typeof COINS)[number];
export type BanknoteDenomination = (typeof BANKNOTES)[number];

export type CoinsStock = Record<CoinDenomination, number>;
export type BanknotesStock = Record<BanknoteDenomination, number>;

export interface MachineMoney {
  coins: CoinsStock;
  banknotes: BanknotesStock;
}

export type ChangeResult = {
  coins?: Partial<CoinsStock>;
  banknotes?: Partial<BanknotesStock>;
};
