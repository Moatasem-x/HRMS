import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-attendance-report-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './attendance-report-filter.html',
  styleUrls: ['./attendance-report-filter.css']
})
export class AttendanceReportFilterComponent {
  fromDate = '';
  toDate = '';
  search = '';

  @Output() filterChange = new EventEmitter<{ fromDate: string; toDate: string; search: string }>();

  showFilters() {
    this.filterChange.emit({ fromDate: this.fromDate, toDate: this.toDate, search: this.search });
  }

  onSearchInput() {
    this.filterChange.emit({ fromDate: '', toDate: '', search: this.search });
  }
} 