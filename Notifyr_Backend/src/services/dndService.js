// Basic recurring-schedule evaluator for global DND. Deliberately simple for pilot
// scope: day-of-week + hour range, evaluated in the SERVER's local time zone.
// Known limitation: doesn't account for the owner's own time zone — fine for a
// single-university pilot where server and users are in the same zone, but flag
// this if the pilot ever spans multiple time zones.
const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function isGlobalDndActiveNow(schedule) {
  if (!schedule || !schedule.enabled) return false;
  if (!Array.isArray(schedule.days) || schedule.days.length === 0) return false;
  if (
    typeof schedule.startHour !== "number" ||
    typeof schedule.endHour !== "number"
  )
    return false;

  const now = new Date();
  const today = DAY_KEYS[now.getDay()];
  if (!schedule.days.includes(today)) return false;

  const hour = now.getHours();
  // Supports overnight ranges too (e.g. startHour 22, endHour 6).
  if (schedule.startHour <= schedule.endHour) {
    return hour >= schedule.startHour && hour < schedule.endHour;
  }
  return hour >= schedule.startHour || hour < schedule.endHour;
}
