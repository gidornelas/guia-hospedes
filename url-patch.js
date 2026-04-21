// Early URL patch loaded via NODE_OPTIONS before any other code
const OriginalURL = globalThis.URL;
globalThis.URL = class extends OriginalURL {
  constructor(input, base) {
    if (typeof base === 'string' && base && !base.startsWith('http') && !base.startsWith('file')) {
      base = 'https://' + base;
    }
    if (typeof input === 'string' && input && !input.startsWith('http') && !input.startsWith('/') && !input.startsWith('file') && !input.startsWith('data:')) {
      if (input.includes('.') && !input.includes(' ')) {
        input = 'https://' + input;
      }
    }
    super(input, base);
  }
};
console.log('[URL-PATCH] URL constructor patched for Railway proxy compatibility');
