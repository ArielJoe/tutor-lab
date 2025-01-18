export function numberToDay(dayNumber: number): string {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Ensure the dayNumber is within the valid range (1-6)
  if (dayNumber < 1 || dayNumber > 6) {
    throw new Error("Invalid day number. Must be between 1 and 6.");
  }

  return days[dayNumber - 1]; // Subtract 1 because array indices start at 0
}
