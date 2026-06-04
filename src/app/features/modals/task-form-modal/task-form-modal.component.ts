import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalShellComponent } from '../modal-shell/modal-shell.component';
import { BoardService } from '../../../core/services/board.service';
import { UiStateService } from '../../../core/services/ui-state.service';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalShellComponent, ReactiveFormsModule],
  templateUrl: './task-form-modal.component.html',
  styleUrl: './task-form-modal.component.scss',
})
export class TaskFormModalComponent implements OnInit {
  private readonly boardService = inject(BoardService);
  protected readonly ui = inject(UiStateService);

  protected readonly isEdit = signal(false);
  protected readonly columnNames = this.boardService.columnNames;
  protected submitted = false;

  protected form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    subtasks: new FormArray<FormControl<string>>([]),
    status: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  get subtasks(): FormArray<FormControl<string>> {
    return this.form.controls.subtasks;
  }

  ngOnInit(): void {
    const location = this.ui.selectedTask();
    if (location) {
      this.isEdit.set(true);
      const task =
        this.boardService.boards()[location.boardIndex]?.columns[location.columnIndex]
          ?.tasks[location.taskIndex];
      if (task) {
        this.form.controls.title.setValue(task.title);
        this.form.controls.description.setValue(task.description);
        this.form.controls.status.setValue(task.status);
        task.subtasks.forEach((s) => this.addSubtask(s.title));
      }
    } else {
      this.addSubtask('');
      this.addSubtask('');
      const first = this.columnNames()[0] ?? '';
      this.form.controls.status.setValue(first);
    }
  }

  addSubtask(value = ''): void {
    this.subtasks.push(
      new FormControl(value, { nonNullable: true, validators: [Validators.required] })
    );
  }

  removeSubtask(index: number): void {
    this.subtasks.removeAt(index);
  }

  close(): void {
    this.ui.closeModal();
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const { title, description, status } = this.form.getRawValue();
    const subtaskTitles = this.subtasks.getRawValue();
    const location = this.ui.selectedTask();

    if (this.isEdit() && location) {
      const existing =
        this.boardService.boards()[location.boardIndex].columns[location.columnIndex].tasks[
          location.taskIndex
        ];
      const subtasks = subtaskTitles.map((t, i) => ({
        title: t,
        isCompleted: existing.subtasks[i]?.isCompleted ?? false,
      }));
      this.boardService.updateTask(
        location.boardIndex,
        location.columnIndex,
        location.taskIndex,
        title,
        description,
        status,
        subtasks
      );
    } else {
      this.boardService.createTask(
        this.boardService.activeIndex(),
        title,
        description,
        status,
        subtaskTitles
      );
    }
    this.ui.closeModal();
  }
}
