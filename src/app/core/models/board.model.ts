export interface Subtask {
  title: string;
  isCompleted: boolean;
}

export interface Task {
  title: string;
  description: string;
  status: string;
  subtasks: Subtask[];
}

export interface Column {
  name: string;
  tasks: Task[];
}

export interface Board {
  name: string;
  columns: Column[];
}

export interface BoardData {
  boards: Board[];
}

export type Theme = 'light' | 'dark';

export interface TaskLocation {
  boardIndex: number;
  columnIndex: number;
  taskIndex: number;
}
