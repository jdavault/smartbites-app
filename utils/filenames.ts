function slugify(text: string): string {
  return text
    .toLowerCase()
    .split(/[\s\-_\,]+/) // split by space, dash, underscore, comma
    .map((token) => token.replace(/[^a-z0-9]/g, '')) // remove all non-alphanumerics
    .filter(Boolean) // remove empty strings
    .sort((a, b) => a.localeCompare(b)) // sort alphabetically
    .join(''); // join with no separator
}

export function formatImageName(
  searchQuery: string,
  allergens: string[],
  extension: string = 'png'
): string {
  const querySlug = slugify(searchQuery);

  const allergensSlug = allergens
    .map((a) => slugify(a))
    .sort((a, b) => a.localeCompare(b))
    .join('');

  return `${querySlug}${allergensSlug}.${extension}`;
}

export function generateRecipeKey(query: string, allergens: string[]): string {
  const querySlug = slugify(query);
  const allergenSlug = allergens
    .map((a) => a.trim().toLowerCase())
    .sort((a, b) => a.localeCompare(b))
    .join('');
  return `${querySlug}${allergenSlug}`;
}
