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
  selector: 'app-board-form-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalShellComponent, ReactiveFormsModule],
  templateUrl: './board-form-modal.component.html',
  styleUrl: './board-form-modal.component.scss',
})
export class BoardFormModalComponent implements OnInit {
  private readonly boardService = inject(BoardService);
  protected readonly ui = inject(UiStateService);

  protected readonly isEdit = signal(false);
  protected submitted = false;

  protected form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    columns: new FormArray<FormControl<string>>([]),
  });

  get columns(): FormArray<FormControl<string>> {
    return this.form.controls.columns;
  }

  ngOnInit(): void {
    if (this.ui.activeModal() === 'editBoard') {
      this.isEdit.set(true);
      const board = this.boardService.activeBoard();
      if (board) {
        this.form.controls.name.setValue(board.name);
        board.columns.forEach((c) => this.addColumn(c.name));
      }
    } else {
      this.addColumn('Todo');
      this.addColumn('Doing');
    }
  }

  addColumn(value = ''): void {
    this.columns.push(
      new FormControl(value, { nonNullable: true, validators: [Validators.required] })
    );
  }

  removeColumn(index: number): void {
    this.columns.removeAt(index);
  }

  close(): void {
    this.ui.closeModal();
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const { name } = this.form.getRawValue();
    const columnNames = this.columns.getRawValue();

    if (this.isEdit()) {
      this.boardService.updateBoard(this.boardService.activeIndex(), name, columnNames);
    } else {
      this.boardService.createBoard(name, columnNames);
    }
    this.ui.closeModal();
  }
}
