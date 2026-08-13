import type { Appointment, StaffMember } from "./types";
import { addMinutesToTime } from "./utils";

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Generate candidate start-time slots (in HH:mm, on a 15-minute grid) for a
 * given staff member, date, and service duration, respecting that staff
 * member's working hours and excluding times that overlap an existing
 * appointment (any status other than cancelled/no-show blocks the slot).
 */
export function getAvailableSlots(
  staffMember: StaffMember,
  date: string,
  durationMinutes: number,
  existingAppointments: Appointment[],
): string[] {
  const dayOfWeek = new Date(`${date}T00:00:00`).getDay();
  const hours = staffMember.workingHours[dayOfWeek];
  if (!hours || hours.closed) return [];

  const startMin = timeToMinutes(hours.start);
  const endMin = timeToMinutes(hours.end);

  const busy = existingAppointments
    .filter((a) => a.staffId === staffMember.id && a.date === date && a.status !== "cancelled" && a.status !== "no-show")
    .map((a) => ({ start: timeToMinutes(a.startTime), end: timeToMinutes(a.startTime) + a.durationMinutes }));

  const slots: string[] = [];
  for (let t = startMin; t + durationMinutes <= endMin; t += 15) {
    const slotEnd = t + durationMinutes;
    const overlaps = busy.some((b) => t < b.end && slotEnd > b.start);
    if (!overlaps) {
      const h = Math.floor(t / 60);
      const m = t % 60;
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

export function appointmentEndTime(a: Appointment): string {
  return addMinutesToTime(a.startTime, a.durationMinutes);
}
