// One-time location read, not continuous tracking — matches the spec's requirement.
// Resolves null on denial/timeout rather than throwing, so callers never need to
// wrap this in their own try/catch just to keep the flow moving.
export function getOneTimeLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      () => resolve(null),
      { timeout: 5000 },
    );
  });
}
