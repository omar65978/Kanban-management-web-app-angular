import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiStateService } from '../../../core/services/ui-state.service';
import { ViewTaskModalComponent } from '../view-task-modal/view-task-modal.component';
import { TaskFormModalComponent } from '../task-form-modal/task-form-modal.component';
import { BoardFormModalComponent } from '../board-form-modal/board-form-modal.component';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

@Component({
  selector: 'app-modal-host',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ViewTaskModalComponent,
    TaskFormModalComponent,
    BoardFormModalComponent,
    DeleteModalComponent,
  ],
  template: `
    @switch (ui.activeModal()) {
      @case ('viewTask') {
        <app-view-task-modal />
      }
      @case ('addTask') {
        <app-task-form-modal />
      }
      @case ('editTask') {
        <app-task-form-modal />
      }
      @case ('addBoard') {
        <app-board-form-modal />
      }
      @case ('editBoard') {
        <app-board-form-modal />
      }
      @case ('deleteBoard') {
        <app-delete-modal />
      }
      @case ('deleteTask') {
        <app-delete-modal />
      }
    }
  `,
})
export class ModalHostComponent {
  protected readonly ui = inject(UiStateService);
}
