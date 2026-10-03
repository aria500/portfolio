// Canonical theme entrances; retain legacy slugs only as lookup keys.
export const themeNavigation = [
  { slug: "anxiety-fighter", href: "/work/made-for-the-feed", title: "Made for the Feed" },
  { slug: "selected-visuals", href: "/work/xiaoping", title: "Ideas Into Campaigns" },
  { slug: "bloom-with-water", href: "/projects/bloom-with-water/drink-to-bloom", title: "Drink to Bloom" },
  { slug: "content-channel", href: "/projects/content-channel", title: "Visual Notes" },
  { slug: "brand-planning", href: "/projects/brand-planning", title: "About" },
] as const;

export function themeFor(slug: string) {
  return themeNavigation.find(theme => theme.slug === slug) ?? themeNavigation[0];
}
export function nextTheme(slug: string) {
  const index = themeNavigation.findIndex(theme => theme.slug === slug);
  return themeNavigation[(index + 1) % themeNavigation.length];
}
