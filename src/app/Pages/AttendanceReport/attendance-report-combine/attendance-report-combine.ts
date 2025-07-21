import { Component, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AttendanceReportFilter } from '../../../Components/attendance-report-filter/attendance-report-filter';
import { AttendanceReportTable } from '../../../Components/attendance-report-table/attendance-report-table';
import { AttendanceService } from '../../../Services/attendance-service';
import { IAttendance } from '../../../Interfaces/iattendance';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-attendance-report-combine',
  standalone: true,
  imports: [AttendanceReportFilter, AttendanceReportTable],
  templateUrl: './attendance-report-combine.html',
  styleUrls: ['./attendance-report-combine.css']
})
export class AttendanceReportCombine implements OnInit, OnDestroy {
  @ViewChild(AttendanceReportTable) table!: AttendanceReportTable;
  allRecords: IAttendance[] = [];
  filteredRecords: IAttendance[] = [];
  subs: Subscription[] = [];

  private lastSearch = '';
  private lastFromDate = '';
  private lastToDate = '';

  constructor(private attendanceService: AttendanceService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadRecords();
  }

  loadRecords() {
    this.subs.push(this.attendanceService.getAttendances().subscribe({
      next: (records) => {
        this.allRecords = records;
        this.filteredRecords = records;
        this.cdr.detectChanges();
        console.log(this.allRecords);
      },
      error: (error) => {
        console.error('Error loading records:', error);
      },
      complete: () => {
        console.log('Records loaded successfully');
      }
    }));
  }

  onFilterChange(filter: { fromDate: string; toDate: string; search: string }) {
    
    if (filter.fromDate === '' && filter.toDate === '') {
      this.lastSearch = filter.search;
      this.filteredRecords = this.allRecords.filter(r =>
        r.employeeName.toLowerCase().includes(this.lastSearch.toLowerCase())
      );
    } 
    else {
      
      this.lastFromDate = filter.fromDate;
      this.lastToDate = filter.toDate;
      this.lastSearch = filter.search;
      let filtered = this.allRecords;
      if (this.lastFromDate) {
        filtered = filtered.filter(r => r.attendanceDate >= this.lastFromDate);
      }
      if (this.lastToDate) {
        filtered = filtered.filter(r => r.attendanceDate <= this.lastToDate);
      }
      if (this.lastSearch) {
        filtered = filtered.filter(r => r.employeeName.toLowerCase().includes(this.lastSearch.toLowerCase()));
      }
      this.filteredRecords = filtered;
    }
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
} 