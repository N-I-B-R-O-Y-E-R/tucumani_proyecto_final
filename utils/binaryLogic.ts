export const ESTADOS_VENTA: Record<string, string> = {
  PENDIENTE: '00',
  COMPLETADO: '01',
  FALLIDO: '10',
  MANTENIMIENTO: '11',
  NUEVA: '100',
  PAGADA: '101'
};

export function codificarEstado(estado: unknown): string {
  const key = String(estado).toUpperCase();
  return ESTADOS_VENTA[key] || '00';
}

export function decodificarEstado(binario: unknown): string {
  const entrada = Object.entries(ESTADOS_VENTA).find((entry) => entry[1] === String(binario));
  return entrada ? entrada[0] : 'DESCONOCIDO';
}

export class BinaryMath {
  static decimalABinario(decimal: unknown): string {
    const numero = Number(decimal);
    if (isNaN(numero) || numero === 0) return "0";
    let binario = "";
    let iterador = numero;
    while (iterador > 0) {
      binario = (iterador % 2) + binario;
      iterador = Math.floor(iterador / 2);
    }
    return binario;
  }

  static binarioADecimal(binario: unknown): number {
    const b = String(binario);
    let decimal = 0;
    const longitud = b.length;
    for (let i = 0; i < longitud; i++) {
      if (b[longitud - 1 - i] === '1') {
        decimal += Math.pow(2, i);
      }
    }
    return decimal;
  }

  static sumarBinarios(bin1: unknown, bin2?: unknown): string {
    if (Array.isArray(bin1)) return bin1.join('');
    const num1 = this.binarioADecimal(bin1);
    const num2 = this.binarioADecimal(bin2 || '0');
    return this.decimalABinario(num1 + num2);
  }
}