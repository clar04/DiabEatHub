export function isLoggedIn(profile) {
  if (!profile) return false;
  return typeof profile.username === "string" && profile.username.trim().length > 0;
}

export function isProfileReady(profile) {
  if (!isLoggedIn(profile) || !profile) return false;
  const { sex, age, height, weight } = profile;
  return (
    !!sex &&
    Number(age) > 0 &&
    Number(height) > 0 &&
    Number(weight) > 0
  );
}
