import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiStateService } from '../../core/services/ui-state.service';
import { BoardListComponent } from '../board-list/board-list.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoardListComponent, ThemeToggleComponent],
  template: `
    <div class="mobile-nav__backdrop" (click)="ui.closeMobileNav()"></div>
    <div class="mobile-nav" role="dialog" aria-label="Boards navigation">
      <app-board-list />
      <div class="mobile-nav__footer">
        <app-theme-toggle />
      </div>
    </div>
  `,
  styleUrl: './mobile-nav.component.scss',
})
export class MobileNavComponent {
  protected readonly ui = inject(UiStateService);
}
