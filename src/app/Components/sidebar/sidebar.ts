import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  isExpanded = false;
  private collapseTimeout: any;

  constructor(private cdr: ChangeDetectorRef) {}

  onSidebarEnter() {
    if (this.collapseTimeout) {
      clearTimeout(this.collapseTimeout);
    }
    this.isExpanded = true;
  }

  onSidebarLeave() {
    this.collapseTimeout = setTimeout(() => {
      this.isExpanded = false;
      this.cdr.markForCheck();
    }, 200);
  }
}
