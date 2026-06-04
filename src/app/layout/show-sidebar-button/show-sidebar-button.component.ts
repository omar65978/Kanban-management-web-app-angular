import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiStateService } from '../../core/services/ui-state.service';

@Component({
  selector: 'app-show-sidebar-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="show-sidebar" aria-label="Show sidebar" (click)="ui.showSidebar()">
      <img src="assets/icon-show-sidebar.svg" alt="" aria-hidden="true" />
    </button>
  `,
  styleUrl: './show-sidebar-button.component.scss',
})
export class ShowSidebarButtonComponent {
  protected readonly ui = inject(UiStateService);
}
