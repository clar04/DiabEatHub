// true jika profile lengkap (sex, age, height, weight tersedia)
export function isProfileReady(profile) {
  return !!(profile?.sex && profile?.age && profile?.height && profile?.weight);
}
