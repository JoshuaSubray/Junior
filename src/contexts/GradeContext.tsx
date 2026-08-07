import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Entry {
  id: string;             // crypto.randomUUID().
  courseId: string;       // Foreign key to parent course.
  categoryId?: string;    // Foreign key to category (e.g. Quizzes, Assignments, etc.).

  name: string;           // e.g. Assignment 1, Midterm
  pointsEarned: number;   // Points earned.
  pointsMax: number;      // Total possible points.
  weight: number;         // Percentage weight.
  isExtraCredit: boolean; // If true, bonus points added to numerator only.
}

export interface Semester {
  id: number;
  name: string;
  entries: Entry[];
}

interface GradeContextType {
  semesters: Semester[];
  activeSemesterId: number | null;
  addSemester: () => void;
  updateSemester: (id: number, updates: Partial<Semester>) => void;
  removeSemester: (id: number) => void;
  setActiveSemester: (id: number) => void;
  addEntry: () => void;
  updateEntry: (id: string, updates: Partial<Entry>) => void;
  removeEntry: (id: string) => void;
}

const GradeContext = createContext<GradeContextType | undefined>(undefined);

export function GradeProvider({ children }: { children: ReactNode }) {
  const [semesters, setSemesters] = useState<Semester[]>([{ id: 1, name: 'Semester 1', entries: [] }]);
  const [activeSemesterId, setActiveSemesterId] = useState<number | null>(1);
  const [nextSemesterId, setNextSemesterId] = useState(2);

  const addSemester = () => {
    const newSemester = { id: nextSemesterId, name: 'Untitled Semester', entries: [] };
    setSemesters([...semesters, newSemester]);
    setActiveSemesterId(newSemester.id);
    setNextSemesterId(nextSemesterId + 1);
  };

  const updateSemester = (id: number, updates: Partial<Semester>) => {
    setSemesters(semesters.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeSemester = (id: number) => {
    setSemesters(semesters.filter(s => s.id !== id));
    if (activeSemesterId === id) {
      setActiveSemesterId(null);
    }
  };

  const setActiveSemester = (id: number) => {
    setActiveSemesterId(id);
  };

  const addEntry = () => {
    if (activeSemesterId === null) return;
    setSemesters(semesters.map(s => {
      if (s.id === activeSemesterId) {
        return {
          ...s,
          entries: [...s.entries, {
            id: crypto.randomUUID(),
            courseId: '',
            name: '',
            pointsEarned: 0,
            pointsMax: 100,
            weight: 0,
            isExtraCredit: false
          }]
        };
      }
      return s;
    }));
  };

  const updateEntry = (entryId: string, updates: Partial<Entry>) => {
    if (activeSemesterId === null) return;
    setSemesters(semesters.map(s => {
      if (s.id === activeSemesterId) {
        return {
          ...s,
          entries: s.entries.map(e => e.id === entryId ? { ...e, ...updates } : e)
        };
      }
      return s;
    }));
  };

  const removeEntry = (entryId: string) => {
    if (activeSemesterId === null) return;
    setSemesters(semesters.map(s => {
      if (s.id === activeSemesterId) {
        return { ...s, entries: s.entries.filter(e => e.id !== entryId) };
      }
      return s;
    }));
  };

  return (
    <GradeContext.Provider
      value={{
        semesters,
        activeSemesterId,
        addSemester,
        updateSemester,
        removeSemester,
        setActiveSemester,
        addEntry,
        updateEntry,
        removeEntry,
      }}
    >
      {children}
    </GradeContext.Provider>
  );
}

export function useGradeContext() {
  const context = useContext(GradeContext);
  if (context === undefined) {
    throw new Error('useGradeContext must be used within a GradeProvider');
  }
  return context;
}