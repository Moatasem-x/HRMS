import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RequestHolidayService } from '../../Services/request-holiday-service';
import { IRequestHoliday } from '../../Interfaces/irequest-holiday';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-holiday-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-holiday-requests.html',
  styleUrl: './manage-holiday-requests.css'
})
export class ManageHolidayRequests implements OnInit {
  requests: IRequestHoliday[] = [];
  filteredRequests: IRequestHoliday[] = [];
  filter: string = 'all';
  isLoading = false;
  error = '';

  constructor(private requestHolidayService: RequestHolidayService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.isLoading = true;
    this.requestHolidayService.getRequestHolidays().subscribe({
      next: (data) => {
        this.requests = data;
        this.applyFilter();
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load requests.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    if (this.filter === 'all') {
      this.filteredRequests = this.requests;
    } else {
      this.filteredRequests = this.requests.filter(r => r.status?.toLowerCase() === this.filter);
    }
  }

  setFilter(status: string): void {
    this.filter = status;
    this.applyFilter();
  }

  getBadgeClass(status: string | undefined): string {
    switch ((status || '').toLowerCase()) {
      case 'approved': return 'badge-approved';
      case 'pending': return 'badge-pending';
      case 'denied': return 'badge-denied';
      default: return 'badge-default';
    }
  }

  takeAction(request: IRequestHoliday, action: string): void {
    console.log(request);
    if (!request.id) return;
    this.requestHolidayService.takeActionOnRequest(request.id, action).subscribe({
      next: (updated) => {
        // Update the request in the list
        const idx = this.requests.findIndex(r => r.id === updated.id);
        if (idx !== -1) this.requests[idx] = updated;
        this.applyFilter();
      },
      error: () => {
        this.error = 'Failed to update request.';
      },
      complete: () => {
      }
    });
  }
}
