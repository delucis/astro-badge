import type { AchievementClass } from './achievementsHelpers';

export const achievementClassBg = (cls: AchievementClass) =>
  (['bg-bronze', 'bg-silver', 'bg-gold'] as const)[cls];

export const achievementClassText = (cls: AchievementClass) =>
  (['text-bronze', 'text-silver', 'text-gold'] as const)[cls];

export const achievementClassGradientFrom = (cls: AchievementClass) =>
  (['from-bronze', 'from-silver', 'from-gold'] as const)[cls];

export const achievementClassSlug = (cls: AchievementClass) =>
  (['bronze', 'silver', 'gold'] as const)[cls];

export const achievementClassLabel = (cls: AchievementClass) =>
  (['Bronze', 'Silver', 'Gold'] as const)[cls];

export const achievementClassEmoji = (cls: AchievementClass) =>
  (['🥉', '🥈', '🥇'] as const)[cls];
