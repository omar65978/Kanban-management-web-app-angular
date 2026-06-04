import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BoardService } from '../../core/services/board.service';
import { UiStateService } from '../../core/services/ui-state.service';

@Component({
  selector: 'app-board-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.scss',
})
export class BoardListComponent {
  private readonly boardService = inject(BoardService);
  private readonly ui = inject(UiStateService);

  protected readonly boards = this.boardService.boards;
  protected readonly activeIndex = this.boardService.activeIndex;

  selectBoard(index: number): void {
    this.boardService.setActiveIndex(index);
    this.ui.closeMobileNav();
  }

  createBoard(): void {
    this.ui.closeMobileNav();
    this.ui.openModal('addBoard');
  }
}
