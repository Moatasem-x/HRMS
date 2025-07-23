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
  filterName: string = '';
  filterDate: string = '';
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
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load requests.';
      }
    });
  }

  applyFilter(): void {
    let filtered = this.requests;
    if (this.filter !== 'all') {
      filtered = filtered.filter(r => r.status?.toLowerCase() === this.filter);
    }
    if (this.filterName.trim()) {
      const name = this.filterName.trim().toLowerCase();
      filtered = filtered.filter(r => (r.employeeName || '').toLowerCase().includes(name));
    }
    if (this.filterDate) {
      filtered = filtered.filter(r => r.requestedAt && r.requestedAt.startsWith(this.filterDate));
    }
    this.filteredRequests = filtered;
    this.cdr.detectChanges();
  }

  setFilter(status: string): void {
    this.filter = status;
    this.applyFilter();
  }

  setNameFilter(name: string): void {
    this.filterName = name;
    this.applyFilter();
  }

  setDateFilter(date: string): void {
    this.filterDate = date;
    this.applyFilter();
  }

  clearFilters(): void {
    this.filter = 'all';
    this.filterName = '';
    this.filterDate = '';
    this.applyFilter();
  }

  getBadgeClass(status: string | undefined): string {
    switch ((status || '').toLowerCase()) {
      case 'approved': return 'badge-approved';
      case 'pending': return 'badge-pending';
      case 'rejected': return 'badge-rejected';
      default: return 'badge-default';
    }
  }

  takeAction(request: IRequestHoliday, action: string): void {
    console.log(request);
    if (!request.id) return;
    this.requestHolidayService.takeActionOnRequest(request.id, action).subscribe({
      next: (updated) => {
        let idx = this.requests.findIndex(r => r.id === request.id);
        this.filteredRequests[idx].status = updated.status;
        this.applyFilter();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to update request.';
      },
      complete: () => {
      }
    });
  }
}
