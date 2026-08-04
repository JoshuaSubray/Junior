import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Entry {
  id: number;
}

export interface Semester {
  id: number;
  entries: Entry[];
}

interface GradeContextType {
  semesters: Semester[];
  activeSemesterId: number | null;
  addSemester: () => void;
  removeSemester: (id: number) => void;
  setActiveSemester: (id: number) => void;
  addEntry: () => void;
  removeEntry: (id: number) => void;
}

const GradeContext = createContext<GradeContextType | undefined>(undefined);

export function GradeProvider({ children }: { children: ReactNode }) {
  const [semesters, setSemesters] = useState<Semester[]>([{ id: 1, entries: [] }]);
  const [activeSemesterId, setActiveSemesterId] = useState<number | null>(1);
  const [nextSemesterId, setNextSemesterId] = useState(2);
  const [nextEntryId, setNextEntryId] = useState(1);

  const addSemester = () => {
    const newSemester = { id: nextSemesterId, entries: [] };
    setSemesters([...semesters, newSemester]);
    setActiveSemesterId(newSemester.id);
    setNextSemesterId(nextSemesterId + 1);
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
        return { ...s, entries: [...s.entries, { id: nextEntryId }] };
      }
      return s;
    }));
    setNextEntryId(nextEntryId + 1);
  };

  const removeEntry = (entryId: number) => {
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
        removeSemester,
        setActiveSemester,
        addEntry,
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