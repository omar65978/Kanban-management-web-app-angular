import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="theme-toggle">
      <img src="assets/icon-light-theme.svg" alt="" aria-hidden="true" />
      <button
        type="button"
        class="theme-toggle__switch"
        role="switch"
        [attr.aria-checked]="themeService.theme() === 'dark'"
        aria-label="Toggle dark mode"
        (click)="themeService.toggle()"
      >
        <span class="theme-toggle__thumb" [class.theme-toggle__thumb--dark]="themeService.theme() === 'dark'"></span>
      </button>
      <img src="assets/icon-dark-theme.svg" alt="" aria-hidden="true" />
    </div>
  `,
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent {
  protected readonly themeService = inject(ThemeService);
}
