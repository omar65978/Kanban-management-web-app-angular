import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { BoardViewComponent } from './features/board/board-view/board-view.component';
import { ShowSidebarButtonComponent } from './layout/show-sidebar-button/show-sidebar-button.component';
import { ModalHostComponent } from './features/modals/modal-host/modal-host.component';
import { UiStateService } from './core/services/ui-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeaderComponent,
    SidebarComponent,
    BoardViewComponent,
    ShowSidebarButtonComponent,
    ModalHostComponent,
  ],
  template: `
    <div class="app-shell" [class.sidebar-collapsed]="!ui.sidebarOpen()">
      <app-header />
      <div class="app-body">
        <app-sidebar />
        <main class="app-main">
          <app-board-view />
        </main>
      </div>
      @if (!ui.sidebarOpen()) {
        <app-show-sidebar-button />
      }
      <app-modal-host />
    </div>
  `,
  styles: [
    `
      .app-shell {
        display: flex;
        flex-direction: column;
        height: 100vh;
        height: 100dvh;
        overflow: hidden;
      }

      .app-body {
        display: flex;
        flex: 1;
        min-height: 0;
      }

      .app-main {
        flex: 1;
        min-width: 0;
        overflow: hidden;
      }
    `,
  ],
})
export class App {
  protected readonly ui = inject(UiStateService);
}
