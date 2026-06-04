import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ModalShellComponent } from '../modal-shell/modal-shell.component';
import { BoardService } from '../../../core/services/board.service';
import { UiStateService } from '../../../core/services/ui-state.service';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalShellComponent],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss',
})
export class DeleteModalComponent {
  private readonly boardService = inject(BoardService);
  protected readonly ui = inject(UiStateService);

  protected readonly isBoard = computed(() => this.ui.activeModal() === 'deleteBoard');

  protected readonly title = computed(() => {
    if (this.isBoard()) {
      return this.boardService.activeBoard()?.name ?? '';
    }
    const loc = this.ui.selectedTask();
    if (!loc) {
      return '';
    }
    return (
      this.boardService.boards()[loc.boardIndex]?.columns[loc.columnIndex]?.tasks[
        loc.taskIndex
      ]?.title ?? ''
    );
  });

  protected readonly message = computed(() => {
    if (this.isBoard()) {
      return `Are you sure you want to delete the '${this.title()}' board? This action will remove all columns and tasks and cannot be reversed.`;
    }
    return `Are you sure you want to delete the '${this.title()}' task and its subtasks? This action cannot be reversed.`;
  });

  close(): void {
    this.ui.closeModal();
  }

  confirm(): void {
    if (this.isBoard()) {
      this.boardService.deleteBoard(this.boardService.activeIndex());
    } else {
      const loc = this.ui.selectedTask();
      if (loc) {
        this.boardService.deleteTask(loc.boardIndex, loc.columnIndex, loc.taskIndex);
      }
    }
    this.ui.closeModal();
  }
}
