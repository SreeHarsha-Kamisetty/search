export const normalizeText = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/['’]/g, '') // remove apostrophes
    .replace(/[^a-z0-9\s.-]/g, ' ') // keep numbers, dots, hyphens
    .replace(/\s+/g, ' ') // collapse spaces
    .trim();
};
