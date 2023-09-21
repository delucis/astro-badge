const sizes = {
  tiny: 120,
  small: 192,
  medium: 240,
  large: 288,
};

const aspectRatio = 6;

export const badgeSizes = Object.keys(sizes).map((slug) => ({
  slug,
  label: slug[0].toUpperCase() + slug.slice(1),
  width: sizes[slug as keyof typeof sizes],
  height: Math.round(sizes[slug as keyof typeof sizes] / aspectRatio),
}));
