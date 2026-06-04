import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ModalShellComponent } from '../modal-shell/modal-shell.component';
import { BoardService } from '../../../core/services/board.service';
import { UiStateService } from '../../../core/services/ui-state.service';
import { Task } from '../../../core/models/board.model';

@Component({
  selector: 'app-view-task-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalShellComponent],
  templateUrl: './view-task-modal.component.html',
  styleUrl: './view-task-modal.component.scss',
})
export class ViewTaskModalComponent {
  private readonly boardService = inject(BoardService);
  protected readonly ui = inject(UiStateService);

  protected readonly menuOpen = signal(false);

  protected readonly location = this.ui.selectedTask;

  protected readonly task = computed<Task | null>(() => {
    const loc = this.location();
    if (!loc) {
      return null;
    }
    return (
      this.boardService.boards()[loc.boardIndex]?.columns[loc.columnIndex]?.tasks[
        loc.taskIndex
      ] ?? null
    );
  });

  protected readonly completedCount = computed(
    () => this.task()?.subtasks.filter((s) => s.isCompleted).length ?? 0
  );

  protected readonly columnNames = this.boardService.columnNames;

  close(): void {
    this.ui.closeModal();
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  toggleSubtask(subtaskIndex: number): void {
    const loc = this.location();
    if (!loc) {
      return;
    }
    this.boardService.toggleSubtask(
      loc.boardIndex,
      loc.columnIndex,
      loc.taskIndex,
      subtaskIndex
    );
  }

  changeStatus(status: string): void {
    const loc = this.location();
    if (!loc || !this.task()) {
      return;
    }
    const currentStatus = this.task()!.status;
    if (status === currentStatus) {
      return;
    }
    const board = this.boardService.boards()[loc.boardIndex];
    const newColumnIndex = board.columns.findIndex((c) => c.name === status);
    const newTaskIndex = board.columns[newColumnIndex]?.tasks.length ?? 0;
    this.boardService.changeTaskStatus(
      loc.boardIndex,
      loc.columnIndex,
      loc.taskIndex,
      status
    );
    this.ui.openModal('viewTask', {
      boardIndex: loc.boardIndex,
      columnIndex: newColumnIndex,
      taskIndex: newTaskIndex,
    });
  }

  editTask(): void {
    this.menuOpen.set(false);
    this.ui.openModal('editTask', this.location());
  }

  deleteTask(): void {
    this.menuOpen.set(false);
    this.ui.openModal('deleteTask', this.location());
  }
}
