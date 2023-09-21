import type { AchievementClass } from './achievementsHelpers';

export const achievementClassBg = (cls: AchievementClass) =>
  (['bg-bronze', 'bg-silver', 'bg-gold'] as const)[cls];

export const achievementClassText = (cls: AchievementClass) =>
  (['text-bronze', 'text-silver', 'text-gold'] as const)[cls];

export const achievementClassGradientFrom = (cls: AchievementClass) =>
  (['from-bronze', 'from-silver', 'from-gold'] as const)[cls];
export const achievementClassGradientTo = (cls: AchievementClass) =>
  (['to-bronze/50', 'to-silver/50', 'to-gold/50'] as const)[cls];

export const achievementClassSlug = (cls: AchievementClass) =>
  (['bronze', 'silver', 'gold'] as const)[cls];

export const achievementClassLabel = (cls: AchievementClass) =>
  (['Bronze', 'Silver', 'Gold'] as const)[cls];

export const achievementClassEmoji = (cls: AchievementClass) =>
  (['🥉', '🥈', '🥇'] as const)[cls];

// background: var(--Gold-Gradient, linear-gradient(120deg, #FFCA58 0%, rgba(255, 202, 88, 0.50) 100%), #FFF);
// background: var(--Silver-Gradient, linear-gradient(120deg, #BFC1C9 0%, #D0D1D7 0.01%, rgba(208, 209, 215, 0.50) 100%), #FFF);
// background: var(--Bronze-Gradient, linear-gradient(120deg, #FF9E58 0%, rgba(255, 158, 88, 0.50) 100%), #FFF);