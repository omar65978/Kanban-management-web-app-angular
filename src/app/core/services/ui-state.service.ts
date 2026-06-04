import { Injectable, signal } from '@angular/core';
import { TaskLocation } from '../models/board.model';

export type ModalType =
  | 'none'
  | 'viewTask'
  | 'addTask'
  | 'editTask'
  | 'addBoard'
  | 'editBoard'
  | 'deleteBoard'
  | 'deleteTask';

@Injectable({ providedIn: 'root' })
export class UiStateService {
  readonly sidebarOpen = signal<boolean>(true);
  readonly mobileNavOpen = signal<boolean>(false);
  readonly activeModal = signal<ModalType>('none');
  readonly selectedTask = signal<TaskLocation | null>(null);

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  showSidebar(): void {
    this.sidebarOpen.set(true);
  }

  toggleMobileNav(): void {
    this.mobileNavOpen.update((open) => !open);
  }

  closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }

  openModal(modal: ModalType, task: TaskLocation | null = null): void {
    this.selectedTask.set(task);
    this.activeModal.set(modal);
  }

  closeModal(): void {
    this.activeModal.set('none');
  }
}
