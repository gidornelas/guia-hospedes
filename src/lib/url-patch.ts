// Monkey-patch URL constructor to handle Railway proxy URLs without protocol
const OriginalURL = globalThis.URL;
(globalThis as any).URL = class extends OriginalURL {
  constructor(input: string | URL, base?: string | URL) {
    // Fix base URLs without protocol (Railway proxy issue)
    if (typeof base === 'string' && base && !base.startsWith('http') && !base.startsWith('file')) {
      base = `https://${base}`;
    }
    // Fix input URLs without protocol
    if (typeof input === 'string' && input && !input.startsWith('http') && !input.startsWith('/') && !input.startsWith('file') && !input.startsWith('data:')) {
      if (input.includes('.') && !input.includes(' ')) {
        input = `https://${input}`;
      }
    }
    super(input, base);
  }
};
