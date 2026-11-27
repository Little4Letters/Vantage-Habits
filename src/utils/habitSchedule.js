function getLocalDateFromKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function isHabitScheduledOn(habit, dateKey) {
  const date = getLocalDateFromKey(dateKey);
  const createdDate = habit.createdAt
    ? String(habit.createdAt).slice(0, 10)
    : null;

  if (createdDate && dateKey < createdDate) return false;
  if (habit.endsOn && dateKey > habit.endsOn) return false;

  if (habit.repeat === "One Time") {
    return createdDate ? dateKey === createdDate : true;
  }
  if (habit.repeat === "Weekly") {
    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      date.getDay()
    ];
    const selectedDays =
      habit.days?.length > 0
        ? habit.days
        : String(habit.frequency || "")
            .split(",")
            .map((day) => day.trim().slice(0, 3));
    return selectedDays.length ? selectedDays.includes(weekday) : true;
  }
  if (habit.repeat === "Monthly" && createdDate) {
    return Number(dateKey.slice(-2)) === Number(createdDate.slice(-2));
  }
  return true;
}
