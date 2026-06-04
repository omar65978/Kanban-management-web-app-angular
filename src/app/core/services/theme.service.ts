import { Injectable, signal, effect } from '@angular/core';
import { Theme } from '../models/board.model';

const THEME_KEY = 'kanban-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.readInitialTheme());

  constructor() {
    effect(() => {
      const current = this.theme();
      document.documentElement.setAttribute('data-theme', current);
      try {
        localStorage.setItem(THEME_KEY, current);
      } catch {
        // ignore storage errors
      }
    });
  }

  toggle(): void {
    this.theme.update((value) => (value === 'light' ? 'dark' : 'light'));
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  private readInitialTheme(): Theme {
    try {
      const stored = localStorage.getItem(THEME_KEY) as Theme | null;
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  }
}
