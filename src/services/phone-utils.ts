import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export class Utilities {
  static normalizePhone(phone: string): string {
    if (!phone) return '';

    let digits = phone.replace(/\D/g, '');

    if (digits.length === 0) return '';

    if (digits.startsWith('8') && digits.length === 11) {
      digits = '7' + digits.substring(1);
    }

    if (digits.startsWith('7') && digits.length === 11) {
      return '+' + digits;
    }

    if (digits.length === 10) {
      return '+7' + digits;
    }

    if (digits.startsWith('7')) {
      return '+' + digits;
    }

    return '+7' + digits;
  }

  static computeHash(value: string): string {
    // MurmurHash3 32-bit with fixed seed 0x9747b28c (matching C code)
    const seed = 0x9747b28c;
    const hash = Utilities.murmur3_32(value, seed);
    // Convert to 8-character hex string
    return hash.toString(16).padStart(8, '0');
  }

  static pad2(n: number): string {
    return n.toString().padStart(2, '0');
  }

  static formatYYMMDD(d: NgbDateStruct): string {
    const yy = (d.year % 100).toString().padStart(2, '0');
    return `${yy}${Utilities.pad2(d.month)}${Utilities.pad2(d.day)}`;
  }

  static formatYYYYMMDD(d: NgbDateStruct): string {
    const yyyy = d.year.toString().padStart(4, '0');
    return `${yyyy}-${Utilities.pad2(d.month)}-${Utilities.pad2(d.day)}`;
  }

  static computePaymentHash(amount: number, started: NgbDateStruct, expired: NgbDateStruct): string {
    const startedStr = Utilities.formatYYYYMMDD(started);
    const expiredStr = Utilities.formatYYYYMMDD(expired);
    const value = `${amount}|${startedStr}|${expiredStr}`;
    return Utilities.computeHash(value);
  }

  /**
   * MurmurHash3 32-bit implementation matching the C code
   * Returns a 32-bit unsigned integer
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static murmur3_32(key: string, seed: number): number {
    // Helper functions
    function rotl32(x: number, r: number): number {
      return ((x << r) | (x >>> (32 - r))) >>> 0;
    }

    function fmix32(h: number): number {
      h ^= h >>> 16;
      h = Math.imul(h, 0x85ebca6b) >>> 0;
      h ^= h >>> 13;
      h = Math.imul(h, 0xc2b2ae35) >>> 0;
      h ^= h >>> 16;
      return h >>> 0;
    }

    const data = new TextEncoder().encode(key);
    const len = data.length;
    const nblocks = Math.floor(len / 4);

    let h1 = seed >>> 0;

    const c1 = 0xcc9e2d51;
    const c2 = 0x1b873593;

    // Process blocks
    for (let i = 0; i < nblocks; i++) {
      const idx = i * 4;
      let k1 = (
        data[idx] |
        (data[idx + 1] << 8) |
        (data[idx + 2] << 16) |
        (data[idx + 3] << 24)
      ) >>> 0;

      k1 = Math.imul(k1, c1) >>> 0;
      k1 = rotl32(k1, 15);
      k1 = Math.imul(k1, c2) >>> 0;

      h1 ^= k1;
      h1 = rotl32(h1, 13);
      h1 = (Math.imul(h1, 5) + 0xe6546b64) >>> 0;
    }

    // Process tail
    const tail = data.subarray(nblocks * 4);
    let k1 = 0;

    // @ts-ignore - Intentional fallthrough in MurmurHash algorithm
    switch (tail.length) {
      case 3: k1 ^= tail[2] << 16;
      case 2: k1 ^= tail[1] << 8;
      case 1: k1 ^= tail[0];
              k1 = Math.imul(k1, c1) >>> 0;
              k1 = rotl32(k1, 15);
              k1 = Math.imul(k1, c2) >>> 0;
              h1 ^= k1;
    }

    // Finalization
    h1 ^= len;
    h1 = fmix32(h1);

    return h1 >>> 0;
  }
}
