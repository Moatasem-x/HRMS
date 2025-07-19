import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface AttendanceRecord {
  serial: number;
  department: string;
  employeeName: string;
  attendanceTime: string;
  leaveTime: string;
  date: string;
  day: string;
}

@Component({
  selector: 'app-attendance-report-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance-report-table.html',
  styleUrls: ['./attendance-report-table.css']
})
export class AttendanceReportTableComponent {
  @Input() records: AttendanceRecord[] = [];
  editIndex: number|null = null;
  editedRecord: AttendanceRecord|null = null;

  editRecord(index: number) {
    this.editIndex = index;
    this.editedRecord = { ...this.records[index] };
  }
  saveRecord(index: number) {
    if (this.editedRecord) {
      this.records[index] = { ...this.editedRecord };
      this.editIndex = null;
      this.editedRecord = null;
    }
  }
  deleteRecord(index: number) {
    this.records.splice(index, 1);
    if (this.editIndex === index) {
      this.editIndex = null;
      this.editedRecord = null;
    }
  }
} 