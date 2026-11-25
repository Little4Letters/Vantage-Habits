import { useEffect, useState } from "react";
import { loadStoredHabits, saveStoredHabits } from "../services/habitStorage";

export const startingHabits = [
  {
    id: "jogging",
    title: "Jogging",
    frequency: "Every day",
    color: "#4388F5",
    icon: "walk-outline",
    completed: false,
  },
  {
    id: "tennis",
    title: "Sports",
    frequency: "Monday, Thursday",
    color: "#F58D60",
    icon: "tennisball-outline",
    completed: false,
  },
  {
    id: "sleep",
    title: "8 Hour Sleep",
    frequency: "Every day",
    color: "#9660E8",
    icon: "bed-outline",
    completed: false,
  },
  {
    id: "reading",
    title: "Read 10 pages",
    frequency: "Every day",
    color: "#47B9A7",
    icon: "book-outline",
    completed: true,
  },
];

export function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useHabits() {
  const [habits, setHabits] = useState(() => {
    const today = getDateKey();
    return startingHabits.map((habit) => ({
      ...habit,
      completedDates: habit.completed ? [today] : [],
    }));
  });
  const [habitsLoaded, setHabitsLoaded] = useState(false);
  const [isLoadingHabits, setIsLoadingHabits] = useState(true);
  const [habitsLoadError, setHabitsLoadError] = useState(null);
  const [habitsLoadAttempt, setHabitsLoadAttempt] = useState(0);

  // useEffect loads saved habits once, or again when Retry is pressed.
  useEffect(() => {
    let isMounted = true;

    const loadHabits = async () => {
      setIsLoadingHabits(true);
      setHabitsLoadError(null);

      try {
        const loadedHabits = await loadStoredHabits();

        if (isMounted && loadedHabits) {
          setHabits(loadedHabits);
        }
      } catch (error) {
        console.warn("Could not load saved habits:", error);
        if (isMounted) {
          setHabitsLoadError(
            "Could not load your saved habits. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingHabits(false);
          setHabitsLoaded(true);
        }
      }
    };

    loadHabits();
    return () => {
      isMounted = false;
    };
  }, [habitsLoadAttempt]);

  // This effect saves every create, update, delete, or completion change.
  useEffect(() => {
    if (!habitsLoaded) return;

    const saveHabits = async () => {
      try {
        await saveStoredHabits(habits);
      } catch (error) {
        console.warn("Could not save habits:", error);
      }
    };

    saveHabits();
  }, [habits, habitsLoaded]);

  const toggleHabit = (habitId, date = getDateKey()) => {
    setHabits((current) =>
      current.map((habit) =>
        habit.id !== habitId
          ? habit
          : (() => {
              const completedDates = habit.completedDates || [];
              const isCompleted = completedDates.includes(date);
              const nextDates = isCompleted
                ? completedDates.filter(
                    (completedDate) => completedDate !== date,
                  )
                : [...completedDates, date];

              return {
                ...habit,
                completedDates: nextDates,
                completed:
                  date === getDateKey() ? !isCompleted : habit.completed,
              };
            })(),
      ),
    );
  };

  const addHabit = (habit) => setHabits((current) => [...current, habit]);

  const updateHabit = (updatedHabit) =>
    setHabits((current) =>
      current.map((habit) =>
        habit.id === updatedHabit.id ? { ...habit, ...updatedHabit } : habit,
      ),
    );

  const deleteHabit = (habitId) =>
    setHabits((current) => current.filter((habit) => habit.id !== habitId));

  const retryLoading = () => {
    setHabitsLoadAttempt((attempt) => attempt + 1);
  };

  return {
    habits,
    isLoadingHabits,
    habitsLoadError,
    retryLoading,
    toggleHabit,
    addHabit,
    updateHabit,
    deleteHabit,
  };
}
