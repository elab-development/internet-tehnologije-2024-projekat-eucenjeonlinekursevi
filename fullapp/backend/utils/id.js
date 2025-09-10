export function randomId(prefix = 'CERT') {
  const core = Math.random().toString(36).slice(2, 8).toUpperCase();
  const tail = Date.now().toString(36).toUpperCase();
  return `${prefix}-${core}${tail}`;
}