const Slot = require("../../models/slots.model");


const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

/**
 * Convert minutes → "HH:mm"
 * Example: 570 → "09:30"
 */
const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

/**
 * Generate reusable slots for a service (Booking.com style)
 * Slots are created ONCE and reused every day
 */
const generateSlotsForService = async ({
  serviceId,
  openingTime,
  closingTime,
  timeRequired
}) => {
  const openingMinutes = timeToMinutes(openingTime);
  const closingMinutes = timeToMinutes(closingTime);

  
  const breakStart = timeToMinutes("13:00"); // 1 PM
  const breakEnd = timeToMinutes("14:00");   // 2 PM

  const slots = [];
  let current = openingMinutes;

  while (current + timeRequired <= closingMinutes) {
    const slotStart = current;
    const slotEnd = current + timeRequired;

    // Skip slots overlapping lunch break
    const overlapsBreak =
      slotStart < breakEnd && slotEnd > breakStart;

    if (!overlapsBreak) {
      slots.push({
        serviceId,
        startTime: minutesToTime(slotStart),
        endTime: minutesToTime(slotEnd)
      });
    }

    current += timeRequired;
  }

  // Insert slots (ignore duplicates safely)
  if (slots.length > 0) {
    await Slot.insertMany(slots, { ordered: false });
  }

  return slots.length;
};

module.exports = {
  timeToMinutes,
  minutesToTime,
  generateSlotsForService
};
