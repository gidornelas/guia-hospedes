// Global error handler to identify the source of Invalid URL errors
process.on('uncaughtException', (err) => {
  if (err instanceof TypeError && err.message.includes('Invalid URL')) {
    console.error('[GLOBAL ERROR] Invalid URL detected:', err);
    console.error('[GLOBAL ERROR] Stack:', err.stack);
  }
});

process.on('unhandledRejection', (reason) => {
  if (reason instanceof TypeError && reason.message.includes('Invalid URL')) {
    console.error('[GLOBAL REJECTION] Invalid URL detected:', reason);
    console.error('[GLOBAL REJECTION] Stack:', reason.stack);
  }
});
