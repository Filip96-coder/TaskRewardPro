import { create } from "zustand";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface TaskStore {
  tasks: Task[];
  toggleTask: (id: number) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [
    { id: 1, title: "Definir metas SMART", description: "Revisar con el equipo", completed: false },
    { id: 2, title: "Configurar entorno React", description: "Instalar dependencias y Tailwind", completed: true },
    { id: 3, title: "Diseñar Dashboard", description: "Mock inicial de tarjetas", completed: false },
  ],
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    })),
}));
