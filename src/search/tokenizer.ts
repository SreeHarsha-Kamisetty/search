import { normalizeText } from './normalizer';

export const tokenize = (input: string): string[] => {
  const normalized = normalizeText(input);

  return normalized.split(' ').filter((token) => token.length > 0);
};
