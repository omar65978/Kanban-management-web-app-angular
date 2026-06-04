import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { BoardService } from '../../core/services/board.service';
import { UiStateService } from '../../core/services/ui-state.service';
import { ThemeService } from '../../core/services/theme.service';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MobileNavComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly boardService = inject(BoardService);
  protected readonly ui = inject(UiStateService);
  protected readonly themeService = inject(ThemeService);

  protected readonly menuOpen = signal(false);

  protected readonly activeBoard = this.boardService.activeBoard;
  protected readonly logoSrc = computed(() =>
    this.themeService.theme() === 'dark' ? 'assets/logo-light.svg' : 'assets/logo-dark.svg'
  );
  protected readonly canAddTask = computed(
    () => (this.activeBoard()?.columns.length ?? 0) > 0
  );

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleMobileNav(): void {
    this.ui.toggleMobileNav();
  }

  addTask(): void {
    if (!this.canAddTask()) {
      return;
    }
    this.ui.openModal('addTask');
  }

  editBoard(): void {
    this.closeMenu();
    this.ui.openModal('editBoard');
  }

  deleteBoard(): void {
    this.closeMenu();
    this.ui.openModal('deleteBoard');
  }
}
