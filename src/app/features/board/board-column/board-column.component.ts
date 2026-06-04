import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import {
  CdkDrag,
  CdkDropList,
  CdkDragDrop,
} from '@angular/cdk/drag-drop';
import { Column } from '../../../core/models/board.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { UiStateService } from '../../../core/services/ui-state.service';
import { BoardService } from '../../../core/services/board.service';

const COLUMN_COLORS = ['#49c4e5', '#8471f2', '#67e2ae', '#e5b349', '#e54980', '#5b8df2', '#bf49e5'];

@Component({
  selector: 'app-board-column',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskCardComponent, CdkDropList, CdkDrag],
  templateUrl: './board-column.component.html',
  styleUrl: './board-column.component.scss',
})
export class BoardColumnComponent {
  private readonly ui = inject(UiStateService);
  private readonly boardService = inject(BoardService);

  readonly column = input.required<Column>();
  readonly columnIndex = input.required<number>();
  readonly boardIndex = input.required<number>();
  readonly connectedListIds = input<string[]>([]);

  readonly dropped = output<CdkDragDrop<number>>();

  protected get dotColor(): string {
    return COLUMN_COLORS[this.columnIndex() % COLUMN_COLORS.length];
  }

  protected get dropListId(): string {
    return `column-${this.columnIndex()}`;
  }

  openTask(taskIndex: number): void {
    this.ui.openModal('viewTask', {
      boardIndex: this.boardIndex(),
      columnIndex: this.columnIndex(),
      taskIndex,
    });
  }

  onDrop(event: CdkDragDrop<number>): void {
    this.dropped.emit(event);
  }
}
