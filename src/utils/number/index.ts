export const number = {
  format(
    value: string | number,
    options?: {
      showDecimal?: boolean;
      fractionDigits?: number;
    },
  ): string {
    const numString =
      typeof value === 'string' ? value.replace(/,/g, '') : value.toString();

    const num = Number(numString);

    if (isNaN(num)) return 'Invalid number';

    const { showDecimal = true, fractionDigits = 2 } = options || {};

    return num.toLocaleString('en-US', {
      maximumFractionDigits: showDecimal ? fractionDigits : 0,
      minimumFractionDigits: showDecimal ? fractionDigits : 0,
    });
  },
};
