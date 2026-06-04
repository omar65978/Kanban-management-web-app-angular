import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Task } from '../../../core/models/board.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="task-card">
      <h3 class="task-card__title heading-md">{{ task().title }}</h3>
      <p class="task-card__subtasks body-md">
        {{ completedCount() }} of {{ task().subtasks.length }} substasks
      </p>
    </article>
  `,
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  readonly task = input.required<Task>();

  protected readonly completedCount = computed(
    () => this.task().subtasks.filter((s) => s.isCompleted).length
  );
}
