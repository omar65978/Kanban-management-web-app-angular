import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BoardService } from '../../../core/services/board.service';
import { UiStateService } from '../../../core/services/ui-state.service';
import { BoardColumnComponent } from '../board-column/board-column.component';

@Component({
  selector: 'app-board-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoardColumnComponent],
  templateUrl: './board-view.component.html',
  styleUrl: './board-view.component.scss',
})
export class BoardViewComponent {
  private readonly boardService = inject(BoardService);
  private readonly ui = inject(UiStateService);

  protected readonly boards = this.boardService.boards;
  protected readonly board = this.boardService.activeBoard;
  protected readonly boardIndex = this.boardService.activeIndex;

  protected readonly connectedListIds = computed(() =>
    (this.board()?.columns ?? []).map((_, i) => `column-${i}`)
  );

  addColumn(): void {
    this.ui.openModal('editBoard');
  }

  createBoard(): void {
    this.ui.openModal('addBoard');
  }

  onDrop(event: CdkDragDrop<number>): void {
    const fromColumnIndex = event.previousContainer.data;
    const toColumnIndex = event.container.data;
    this.boardService.moveTask(
      this.boardIndex(),
      fromColumnIndex,
      toColumnIndex,
      event.previousIndex,
      event.currentIndex
    );
  }
}
