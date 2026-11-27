import { useCallback, useEffect, useRef, useState } from "react";
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

// The useHabits hook manages the state of habits and their completion history.
// It loads saved habits from AsyncStorage, allows toggling habit completion as follows:

// adding, updating, and deleting habits, and saves changes back to AsyncStorage.
// It also handles loading errors and provides a retry mechanism.
export function useHabits(accountId) {
  const [habits, setHabits] = useState([]);
  const [isLoadingHabits, setIsLoadingHabits] = useState(true);
  const [habitsLoadError, setHabitsLoadError] = useState(null);
  const [habitsLoadAttempt, setHabitsLoadAttempt] = useState(0);
  const [completionHistory, setCompletionHistory] = useState([]);
  const stateRef = useRef({ habits: [], completionHistory: [] });
  const saveQueue = useRef(Promise.resolve());

  // useEffect loads saved habits once, or again when Retry is pressed.
  useEffect(() => {
    let isMounted = true;

    const loadHabits = async () => {
      setIsLoadingHabits(true);
      setHabitsLoadError(null);

      // Load habits and completion history in parallel, then normalize the data.
      try {
        const [loadedHabits, loadedHistory] = await Promise.all([
          loadStoredHabits(accountId),
          loadStoredCompletionHistory(accountId),
        ]);

        // If the component is still mounted, update the state with the loaded habits and completion history.
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

          // Combine the loaded history and derived history, ensuring no duplicates, and update the completion history state.
          const historyById = new Map(
            [...loadedHistory, ...derivedHistory].map((entry) => [
              entry.id,
              entry,
            ]),
          );
          const nextState = {
            habits: normalizedHabits,
            completionHistory: Array.from(historyById.values()),
          };
          stateRef.current = nextState;
          setCompletionHistory(nextState.completionHistory);
        } else if (isMounted) {
          stateRef.current = { habits: [], completionHistory: loadedHistory };
          setHabits([]);
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
        }
      }
    };

    loadHabits();
    return () => {
      isMounted = false;
    };
  }, [accountId, habitsLoadAttempt]);

  const commitState = useCallback(
    (update) => {
      const operation = saveQueue.current.then(async () => {
        const nextState = update(stateRef.current);
        await Promise.all([
          saveStoredHabits(nextState.habits, accountId),
          saveStoredCompletionHistory(nextState.completionHistory, accountId),
        ]);
        stateRef.current = nextState;
        setHabits(nextState.habits);
        setCompletionHistory(nextState.completionHistory);
      });
      saveQueue.current = operation.catch(() => {});
      return operation;
    },
    [accountId],
  );

  // The `toggleHabit` function toggles the completion status of a habit for a specific date (defaulting to today).
  // It updates the habit's completedDates array and the completion history accordingly.

  const toggleHabit = (habitId, date = getDateKey()) =>
    commitState((current) => {
      const habit = current.habits.find((item) => item.id === habitId);
      if (!habit) return current;

      const completedDates = habit.completedDates || [];
      const isCompleted = completedDates.includes(date);
      const nextDates = isCompleted
        ? completedDates.filter((completedDate) => completedDate !== date)
        : [...completedDates, date];
      const entryId = `${habitId}:${date}`;
      const nextHistory = isCompleted
        ? current.completionHistory.filter((entry) => entry.id !== entryId)
        : [
            ...current.completionHistory.filter(
              (entry) => entry.id !== entryId,
            ),
            {
              id: entryId,
              habitId,
              date,
              completedAt: new Date().toISOString(),
            },
          ];

      return {
        habits: current.habits.map((item) =>
          item.id === habitId
            ? {
                ...item,
                completedDates: nextDates,
                completed:
                  date === getDateKey() ? !isCompleted : item.completed,
              }
            : item,
        ),
        completionHistory: nextHistory,
      };
    });

  const addHabit = (habit) =>
    commitState((current) => ({
      ...current,
      habits: [
        ...current.habits,
        {
          ...habit,
          completed: false,
          completedDates: habit.completedDates || [],
        },
      ],
    }));

  const updateHabit = (updatedHabit) =>
    commitState((current) => ({
      ...current,
      habits: current.habits.map((habit) =>
        habit.id === updatedHabit.id ? { ...habit, ...updatedHabit } : habit,
      ),
    }));

  const deleteHabit = (habitId) =>
    commitState((current) => ({
      habits: current.habits.filter((habit) => habit.id !== habitId),
      completionHistory: current.completionHistory.filter(
        (entry) => entry.habitId !== habitId,
      ),
    }));

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
