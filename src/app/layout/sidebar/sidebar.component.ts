import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiStateService } from '../../core/services/ui-state.service';
import { BoardListComponent } from '../board-list/board-list.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoardListComponent, ThemeToggleComponent],
  template: `
    <aside class="sidebar" [class.sidebar--hidden]="!ui.sidebarOpen()">
      <div class="sidebar__inner">
        <app-board-list />
        <div class="sidebar__footer">
          <app-theme-toggle />
          <button type="button" class="sidebar__hide" (click)="ui.toggleSidebar()">
            <img src="assets/icon-hide-sidebar.svg" alt="" aria-hidden="true" />
            <span class="heading-md">Hide Sidebar</span>
          </button>
        </div>
      </div>
    </aside>
  `,
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  protected readonly ui = inject(UiStateService);
}
