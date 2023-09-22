const sizes = {
  tiny: 120,
  small: 192,
  medium: 240,
  large: 288,
} as const;

const aspectRatio = 6;

export const badgeSizes = Object.keys(sizes).map((slug: keyof typeof sizes) => ({
  slug,
  label: slug[0].toUpperCase() + slug.slice(1),
  shortLabel: slug === 'tiny' ? 'XS' : slug[0].toUpperCase(),
  width: sizes[slug],
  height: Math.round(sizes[slug] / aspectRatio),
}));
