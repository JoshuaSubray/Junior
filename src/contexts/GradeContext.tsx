import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Item {
  id: string;
  name: string;
  grade: number;            // Direct percentage.
  weightOverride?: number;  // Overrides percentage set by auto-split.
  isExtraCredit: boolean;   // If true, contributes to grade numerator only (bonus points).
}

export interface Category {
  id: string;
  name: string;
  totalWeight: number;  // Percentage of the course's final grade this category is worth.
  items: Item[];
}

export interface Course {
  id: string;
  name: string;
  categories: Category[];
}

export interface Semester {
  id: number;
  name: string;
  courses: Course[];
}

interface GradeContextType {
  semesters: Semester[];
  activeSemesterId: number | null;
  // Semester CRUD.
  addSemester: () => void;
  updateSemester: (id: number, updates: Partial<Semester>) => void;
  removeSemester: (id: number) => void;
  setActiveSemester: (id: number) => void;
  // Course CRUD.
  addCourse: () => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  removeCourse: (courseId: string) => void;
  // Category CRUD.
  addCategory: (courseId: string) => void;
  updateCategory: (courseId: string, categoryId: string, updates: Partial<Category>) => void;
  removeCategory: (courseId: string, categoryId: string) => void;
  // Item CRUD.
  addItem: (courseId: string, categoryId: string) => void;
  updateItem: (courseId: string, categoryId: string, itemId: string, updates: Partial<Item>) => void;
  removeItem: (courseId: string, categoryId: string, itemId: string) => void;
}

const GradeContext = createContext<GradeContextType | undefined>(undefined);

export function GradeProvider({ children }: { children: ReactNode }) {
  const [semesters, setSemesters] = useState<Semester[]>([{ id: 1, name: 'Semester 1', courses: [] }]);
  const [activeSemesterId, setActiveSemesterId] = useState<number | null>(1);
  const [nextSemesterId, setNextSemesterId] = useState(2);

  // Semester CRUD.

  const addSemester = () => {
    const newSemester: Semester = { id: nextSemesterId, name: 'Untitled Semester', courses: [] };
    setSemesters(prev => [...prev, newSemester]);
    setActiveSemesterId(newSemester.id);
    setNextSemesterId(prev => prev + 1);
  };

  const updateSemester = (id: number, updates: Partial<Semester>) => {
    setSemesters(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeSemester = (id: number) => {
    setSemesters(prev => prev.filter(s => s.id !== id));
    if (activeSemesterId === id) setActiveSemesterId(null);
  };

  const setActiveSemester = (id: number) => setActiveSemesterId(id);

  // Shared helpers for nested updates.

  const modifyActiveSemester = (fn: (courses: Course[]) => Course[]) => {
    setSemesters(prev => prev.map(s =>
      s.id === activeSemesterId ? { ...s, courses: fn(s.courses) } : s
    ));
  };

  const modifyCourse = (courseId: string, fn: (cats: Category[]) => Category[]) => {
    modifyActiveSemester(courses =>
      courses.map(c => c.id === courseId ? { ...c, categories: fn(c.categories) } : c)
    );
  };

  const modifyCategory = (courseId: string, categoryId: string, fn: (items: Item[]) => Item[]) => {
    modifyCourse(courseId, cats =>
      cats.map(cat => cat.id === categoryId ? { ...cat, items: fn(cat.items) } : cat)
    );
  };

  // Course CRUD.

  const addCourse = () => {
    if (activeSemesterId === null) return;
    const newCourse: Course = { id: crypto.randomUUID(), name: '', categories: [] };
    modifyActiveSemester(courses => [...courses, newCourse]);
  };

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    if (activeSemesterId === null) return;
    modifyActiveSemester(courses =>
      courses.map(c => c.id === courseId ? { ...c, ...updates } : c)
    );
  };

  const removeCourse = (courseId: string) => {
    if (activeSemesterId === null) return;
    modifyActiveSemester(courses => courses.filter(c => c.id !== courseId));
  };

  // Category CRUD.

  const addCategory = (courseId: string) => {
    const newCat: Category = { id: crypto.randomUUID(), name: '', totalWeight: 0, items: [] };
    modifyCourse(courseId, cats => [...cats, newCat]);
  };

  const updateCategory = (courseId: string, categoryId: string, updates: Partial<Category>) => {
    modifyCourse(courseId, cats =>
      cats.map(cat => cat.id === categoryId ? { ...cat, ...updates } : cat)
    );
  };

  const removeCategory = (courseId: string, categoryId: string) => {
    modifyCourse(courseId, cats => cats.filter(cat => cat.id !== categoryId));
  };

  // Item CRUD.

  const addItem = (courseId: string, categoryId: string) => {
    const newItem: Item = { id: crypto.randomUUID(), name: '', grade: 0, isExtraCredit: false };
    modifyCategory(courseId, categoryId, items => [...items, newItem]);
  };

  const updateItem = (courseId: string, categoryId: string, itemId: string, updates: Partial<Item>) => {
    modifyCategory(courseId, categoryId, items =>
      items.map(item => item.id === itemId ? { ...item, ...updates } : item)
    );
  };

  const removeItem = (courseId: string, categoryId: string, itemId: string) => {
    modifyCategory(courseId, categoryId, items => items.filter(item => item.id !== itemId));
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
        addCourse,
        updateCourse,
        removeCourse,
        addCategory,
        updateCategory,
        removeCategory,
        addItem,
        updateItem,
        removeItem,
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