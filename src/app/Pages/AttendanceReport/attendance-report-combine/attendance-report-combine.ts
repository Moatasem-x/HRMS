import { Component, ViewChild } from '@angular/core';
import { AttendanceReportFilterComponent } from '../attendance-report-filter/attendance-report-filter';
import { AttendanceReportTableComponent } from '../attendance-report-table/attendance-report-table';

@Component({
  selector: 'app-attendance-report-combine',
  standalone: true,
  imports: [AttendanceReportFilterComponent, AttendanceReportTableComponent],
  templateUrl: './attendance-report-combine.html',
  styleUrls: ['./attendance-report-combine.css']
})
export class AttendanceReportCombineComponent {
  @ViewChild(AttendanceReportTableComponent) table!: AttendanceReportTableComponent;
  allRecords = [
    { serial: 1, department: 'Development', employeeName: 'Employee 1', attendanceTime: '09:00', leaveTime: '17:00', date: '2021-08-11', day: 'Monday' },
    { serial: 2, department: 'Accounting', employeeName: 'Employee 2', attendanceTime: '09:00', leaveTime: '18:00', date: '2021-08-11', day: 'Monday' },
    { serial: 3, department: 'Accounting', employeeName: 'Employee 3', attendanceTime: '08:30', leaveTime: '16:30', date: '2021-08-12', day: 'Tuesday' },
    { serial: 4, department: 'Marketing', employeeName: 'Employee 4', attendanceTime: '10:00', leaveTime: '18:00', date: '2021-08-13', day: 'Wednesday' },
    { serial: 5, department: 'HR', employeeName: 'Employee 5', attendanceTime: '08:00', leaveTime: '16:00', date: '2021-08-14', day: 'Thursday' },
    { serial: 6, department: 'Development', employeeName: 'Employee 6', attendanceTime: '09:15', leaveTime: '17:15', date: '2021-08-15', day: 'Friday' },
    { serial: 7, department: 'Accounting', employeeName: 'Employee 7', attendanceTime: '09:30', leaveTime: '18:30', date: '2021-08-16', day: 'Saturday' },
    { serial: 8, department: 'Marketing', employeeName: 'Employee 8', attendanceTime: '10:30', leaveTime: '19:00', date: '2021-08-17', day: 'Sunday' },
    { serial: 9, department: 'HR', employeeName: 'Employee 9', attendanceTime: '08:45', leaveTime: '16:45', date: '2021-08-18', day: 'Monday' },
    { serial: 10, department: 'Development', employeeName: 'Employee 10', attendanceTime: '09:00', leaveTime: '17:00', date: '2021-08-19', day: 'Tuesday' },
  ];
  filteredRecords = this.allRecords;

  onFilterChange(filter: { fromDate: string; toDate: string; search: string }) {
    let filtered = this.allRecords;
    if (filter.fromDate) {
      filtered = filtered.filter(r => r.date >= filter.fromDate);
    }
    if (filter.toDate) {
      filtered = filtered.filter(r => r.date <= filter.toDate);
    }
    if (filter.search) {
      const s = filter.search.toLowerCase();
      filtered = filtered.filter(r => r.employeeName.toLowerCase().includes(s) || r.department.toLowerCase().includes(s));
    }
    this.filteredRecords = filtered;
    if (this.table) {
      this.table.records = filtered;
    }
  }
} 