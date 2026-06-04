import { Injectable, computed, effect, signal } from '@angular/core';
import { Board, Column, Subtask, Task } from '../models/board.model';
import { SEED_DATA } from '../data/seed-data';

const STORAGE_KEY = 'kanban-boards';
const ACTIVE_KEY = 'kanban-active-board';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly boardsSignal = signal<Board[]>(this.loadBoards());
  private readonly activeIndexSignal = signal<number>(this.loadActiveIndex());

  readonly boards = this.boardsSignal.asReadonly();
  readonly activeIndex = this.activeIndexSignal.asReadonly();

  readonly activeBoard = computed<Board | null>(() => {
    const boards = this.boardsSignal();
    const index = this.activeIndexSignal();
    return boards[index] ?? null;
  });

  readonly columnNames = computed<string[]>(
    () => this.activeBoard()?.columns.map((c) => c.name) ?? []
  );

  constructor() {
    effect(() => {
      const boards = this.boardsSignal();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
      } catch {
        // ignore
      }
    });

    effect(() => {
      const index = this.activeIndexSignal();
      try {
        localStorage.setItem(ACTIVE_KEY, String(index));
      } catch {
        // ignore
      }
    });
  }

  setActiveIndex(index: number): void {
    if (index >= 0 && index < this.boardsSignal().length) {
      this.activeIndexSignal.set(index);
    }
  }

  createBoard(name: string, columnNames: string[]): void {
    const board: Board = {
      name: name.trim(),
      columns: columnNames
        .map((c) => c.trim())
        .filter((c) => c.length > 0)
        .map((c) => ({ name: c, tasks: [] })),
    };
    this.boardsSignal.update((boards) => [...boards, board]);
    this.activeIndexSignal.set(this.boardsSignal().length - 1);
  }

  updateBoard(boardIndex: number, name: string, columnNames: string[]): void {
    this.boardsSignal.update((boards) => {
      const next = clone(boards);
      const board = next[boardIndex];
      if (!board) {
        return boards;
      }
      const existing = board.columns;
      const newColumns: Column[] = columnNames
        .map((c) => c.trim())
        .filter((c) => c.length > 0)
        .map((colName, i) => {
          const previous = existing[i];
          if (previous) {
            return {
              name: colName,
              tasks: previous.tasks.map((t) => ({ ...t, status: colName })),
            };
          }
          return { name: colName, tasks: [] };
        });
      board.name = name.trim();
      board.columns = newColumns;
      return next;
    });
  }

  deleteBoard(boardIndex: number): void {
    this.boardsSignal.update((boards) => boards.filter((_, i) => i !== boardIndex));
    const length = this.boardsSignal().length;
    if (this.activeIndexSignal() >= length) {
      this.activeIndexSignal.set(Math.max(0, length - 1));
    }
  }

  addColumnToActiveBoard(): void {
    // Helper retained for potential external use; columns are managed via edit board.
  }

  createTask(
    boardIndex: number,
    title: string,
    description: string,
    status: string,
    subtaskTitles: string[]
  ): void {
    this.boardsSignal.update((boards) => {
      const next = clone(boards);
      const board = next[boardIndex];
      if (!board) {
        return boards;
      }
      const column = board.columns.find((c) => c.name === status) ?? board.columns[0];
      if (!column) {
        return boards;
      }
      const task: Task = {
        title: title.trim(),
        description: description.trim(),
        status: column.name,
        subtasks: subtaskTitles
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
          .map((t) => ({ title: t, isCompleted: false })),
      };
      column.tasks.push(task);
      return next;
    });
  }

  updateTask(
    boardIndex: number,
    columnIndex: number,
    taskIndex: number,
    title: string,
    description: string,
    status: string,
    subtasks: Subtask[]
  ): void {
    this.boardsSignal.update((boards) => {
      const next = clone(boards);
      const board = next[boardIndex];
      if (!board) {
        return boards;
      }
      const sourceColumn = board.columns[columnIndex];
      if (!sourceColumn) {
        return boards;
      }
      const task = sourceColumn.tasks[taskIndex];
      if (!task) {
        return boards;
      }
      task.title = title.trim();
      task.description = description.trim();
      task.subtasks = subtasks
        .map((s) => ({ title: s.title.trim(), isCompleted: s.isCompleted }))
        .filter((s) => s.title.length > 0);

      const targetColumn = board.columns.find((c) => c.name === status);
      if (targetColumn && targetColumn !== sourceColumn) {
        sourceColumn.tasks.splice(taskIndex, 1);
        task.status = targetColumn.name;
        targetColumn.tasks.push(task);
      } else {
        task.status = sourceColumn.name;
      }
      return next;
    });
  }

  deleteTask(boardIndex: number, columnIndex: number, taskIndex: number): void {
    this.boardsSignal.update((boards) => {
      const next = clone(boards);
      const column = next[boardIndex]?.columns[columnIndex];
      if (!column) {
        return boards;
      }
      column.tasks.splice(taskIndex, 1);
      return next;
    });
  }

  toggleSubtask(
    boardIndex: number,
    columnIndex: number,
    taskIndex: number,
    subtaskIndex: number
  ): void {
    this.boardsSignal.update((boards) => {
      const next = clone(boards);
      const subtask =
        next[boardIndex]?.columns[columnIndex]?.tasks[taskIndex]?.subtasks[subtaskIndex];
      if (!subtask) {
        return boards;
      }
      subtask.isCompleted = !subtask.isCompleted;
      return next;
    });
  }

  changeTaskStatus(
    boardIndex: number,
    columnIndex: number,
    taskIndex: number,
    newStatus: string
  ): void {
    this.boardsSignal.update((boards) => {
      const next = clone(boards);
      const board = next[boardIndex];
      const sourceColumn = board?.columns[columnIndex];
      const task = sourceColumn?.tasks[taskIndex];
      if (!board || !sourceColumn || !task) {
        return boards;
      }
      const targetColumn = board.columns.find((c) => c.name === newStatus);
      if (!targetColumn || targetColumn === sourceColumn) {
        return boards;
      }
      sourceColumn.tasks.splice(taskIndex, 1);
      task.status = targetColumn.name;
      targetColumn.tasks.push(task);
      return next;
    });
  }

  moveTask(
    boardIndex: number,
    fromColumnIndex: number,
    toColumnIndex: number,
    fromTaskIndex: number,
    toTaskIndex: number
  ): void {
    this.boardsSignal.update((boards) => {
      const next = clone(boards);
      const board = next[boardIndex];
      const fromColumn = board?.columns[fromColumnIndex];
      const toColumn = board?.columns[toColumnIndex];
      if (!board || !fromColumn || !toColumn) {
        return boards;
      }
      const [task] = fromColumn.tasks.splice(fromTaskIndex, 1);
      if (!task) {
        return boards;
      }
      task.status = toColumn.name;
      toColumn.tasks.splice(toTaskIndex, 0, task);
      return next;
    });
  }

  resetData(): void {
    this.boardsSignal.set(clone(SEED_DATA.boards));
    this.activeIndexSignal.set(0);
  }

  private loadBoards(): Board[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Board[];
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return clone(SEED_DATA.boards);
  }

  private loadActiveIndex(): number {
    try {
      const raw = localStorage.getItem(ACTIVE_KEY);
      if (raw !== null) {
        const parsed = Number(raw);
        if (!Number.isNaN(parsed)) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return 0;
  }
}
