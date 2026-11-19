export function formatRupees(amount) {
  const n = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(n);
}

export function formatNumber(num) {
  const n = Number(num) || 0;
  return new Intl.NumberFormat('en-IN').format(n);
}

export function formatDate(date) {
  if (!date) return '-';
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(d);
}

export function formatDateTime(date) {
  if (!date) return '-';
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(d);
}
