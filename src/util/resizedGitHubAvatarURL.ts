export const resizedGitHubAvatarURL = (avatarURL: string, size: number) => {
  const url = new URL(avatarURL);
  url.searchParams.set('s', String(size));
  return url.href;
};
