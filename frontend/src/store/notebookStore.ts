import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { id: number; text: string }[];
}

export interface SourceItem {
  id: number;
  title: string;
  type: string;
  selected: boolean;
}

export interface Notebook {
  id: string;
  title: string;
  createdAt: string;
  sources?: SourceItem[];
  messages?: Message[];
}

interface NotebookStore {
  notebooks: Notebook[];
  currentNotebook: Notebook | null;
  setNotebooks: (notebooks: Notebook[]) => void;
  setCurrentNotebook: (notebook: Notebook | null) => void;
  updateNotebook: (id: string, updates: Partial<Notebook>) => void;
}

export const useNotebookStore = create<NotebookStore>()(
  persist(
    (set) => ({
      notebooks: [
        { id: "1", title: "Project Alpha", createdAt: new Date().toISOString() },
        { id: "2", title: "Q3 Research", createdAt: new Date().toISOString() },
      ],
      currentNotebook: null,
      setNotebooks: (notebooks) => set({ notebooks }),
      setCurrentNotebook: (notebook) => set({ currentNotebook: notebook }),
      updateNotebook: (id, updates) => set((state) => {
        const updatedNotebooks = state.notebooks.map(n => n.id === id ? { ...n, ...updates } : n);
        const updatedCurrent = state.currentNotebook?.id === id ? { ...state.currentNotebook, ...updates } : state.currentNotebook;
        return { notebooks: updatedNotebooks, currentNotebook: updatedCurrent };
      })
    }),
    {
      name: 'notebook-storage',
    }
  )
);
