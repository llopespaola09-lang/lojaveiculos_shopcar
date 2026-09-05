export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Calculates monthly installment using standard price amortization formula
 * @param principal Loan principal (Vehicle price - down payment)
 * @param annualInterestRate Annual interest rate as percentage (e.g. 15.9%)
 * @param months Number of installments (e.g. 48)
 */
export function calculateInstallment(
  principal: number,
  annualInterestRate: number = 16.5,
  months: number = 48
): number {
  if (principal <= 0) return 0;
  // Monthly interest rate
  const monthlyRate = Math.pow(1 + annualInterestRate / 100, 1 / 12) - 1;
  const payment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(payment);
}

export function createWhatsAppLink(message: string, phone: string = '5511998765432'): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
