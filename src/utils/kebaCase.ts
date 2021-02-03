export function kebaCase(str: string | null) {
  if (!str) return null;
  if (str.length > 1 && /[A-Z]/.test(str.charAt(0))) {
    str = str.charAt(0).toLowerCase() + str.slice(1);
  }
  return str.replace(/[A-Z]/g, i => "-" + i.toLowerCase());
}
