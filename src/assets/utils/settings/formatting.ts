export function formatAddress(address: string, unit: string, index: number) {
  if (address === '' || address === null || address === undefined) {
    return '';
  }

  const trimmed = address.split(',');

  if (!index) {
    return trimmed[index] + (unit ? ' - ' + unit : '');
  } else {
    return trimmed[index];
  }
}
