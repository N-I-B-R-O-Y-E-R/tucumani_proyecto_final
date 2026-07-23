export const ESTADOS_VENTA = {
  NUEVA: 1,       // 001
  PAGADA: 2,      // 010
  FACTURADA: 4,   // 100
  ANULADA: 8      // 1000
};

export function codificarEstado(estadosArray: number[]): number {
  return estadosArray.reduce((acc, estado) => acc | estado, 0);
}

export function decodificarEstado(estadoBinario: number): string {
  const estados: string[] = [];
  if ((estadoBinario & ESTADOS_VENTA.NUEVA) === ESTADOS_VENTA.NUEVA) estados.push('Nueva');
  if ((estadoBinario & ESTADOS_VENTA.PAGADA) === ESTADOS_VENTA.PAGADA) estados.push('Pagada');
  if ((estadoBinario & ESTADOS_VENTA.FACTURADA) === ESTADOS_VENTA.FACTURADA) estados.push('Facturada');
  if ((estadoBinario & ESTADOS_VENTA.ANULADA) === ESTADOS_VENTA.ANULADA) estados.push('Anulada');
  return estados.length > 0 ? estados.join(' + ') : 'Desconocido';
}