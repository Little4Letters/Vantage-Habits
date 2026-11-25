import { useEffect, useState } from "react";
import {
  loadStoredHabits,
  saveStoredHabits,
  loadStoredCompletionHistory,
  saveStoredCompletionHistory,
} from "../services/habitStorage";

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
  const [completionHistory, setCompletionHistory] = useState([]);

  // useEffect loads saved habits once, or again when Retry is pressed.
  useEffect(() => {
    let isMounted = true;

    const loadHabits = async () => {
      setIsLoadingHabits(true);
      setHabitsLoadError(null);

      try {
        const [loadedHabits, loadedHistory] = await Promise.all([
          loadStoredHabits(),
          loadStoredCompletionHistory(),
        ]);

        if (isMounted && loadedHabits) {
          const normalizedHabits = loadedHabits.map((habit) => ({
            ...habit,
            completed: Boolean(habit.completed),
            completedDates: habit.completedDates || [],
          }));
          setHabits(normalizedHabits);

          const derivedHistory = normalizedHabits.flatMap((habit) =>
            (habit.completedDates || []).map((date) => ({
              id: `${habit.id}:${date}`,
              habitId: habit.id,
              date,
              completedAt: new Date().toISOString(),
            })),
          );

          const historyById = new Map(
            [...loadedHistory, ...derivedHistory].map((entry) => [
              entry.id,
              entry,
            ]),
          );
          setCompletionHistory(Array.from(historyById.values()));
        } else if (isMounted) {
          setCompletionHistory(loadedHistory);
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
        await Promise.all([
          saveStoredHabits(habits),
          saveStoredCompletionHistory(completionHistory),
        ]);
      } catch (error) {
        console.warn("Could not save habits:", error);
      }
    };

    saveHabits();
  }, [habits, completionHistory, habitsLoaded]);

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

              setCompletionHistory((history) => {
                const entryId = `${habitId}:${date}`;
                return isCompleted
                  ? history.filter((entry) => entry.id !== entryId)
                  : [
                      ...history.filter((entry) => entry.id !== entryId),
                      {
                        id: entryId,
                        habitId,
                        date,
                        completedAt: new Date().toISOString(),
                      },
                    ];
              });

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

  const addHabit = (habit) =>
    setHabits((current) => [
      ...current,
      {
        ...habit,
        completed: false,
        completedDates: habit.completedDates || [],
      },
    ]);

  const updateHabit = (updatedHabit) =>
    setHabits((current) =>
      current.map((habit) =>
        habit.id === updatedHabit.id ? { ...habit, ...updatedHabit } : habit,
      ),
    );

  const deleteHabit = (habitId) => {
    setHabits((current) => current.filter((habit) => habit.id !== habitId));
    setCompletionHistory((history) =>
      history.filter((entry) => entry.habitId !== habitId),
    );
  };

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
    completionHistory,
  };
}
