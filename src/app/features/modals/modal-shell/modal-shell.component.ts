import { ChangeDetectionStrategy, Component, HostListener, output } from '@angular/core';

@Component({
  selector: 'app-modal-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overlay" (click)="onOverlayClick($event)">
      <div class="modal" role="dialog" aria-modal="true" (click)="$event.stopPropagation()">
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './modal-shell.component.scss',
})
export class ModalShellComponent {
  readonly closed = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closed.emit();
  }

  onOverlayClick(_event: MouseEvent): void {
    this.closed.emit();
  }
}
