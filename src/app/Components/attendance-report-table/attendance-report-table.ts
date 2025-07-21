import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IAttendance } from '../../Interfaces/iattendance';
import Swal from 'sweetalert2';
import { AttendanceService } from '../../Services/attendance-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-attendance-report-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance-report-table.html',
  styleUrls: ['./attendance-report-table.css']
})
export class AttendanceReportTable {

  constructor(private attendanceService: AttendanceService, private cdr: ChangeDetectorRef) {}
  @Input() records: IAttendance[] = [];
  subs: Subscription[] = [];
  error: string | null = null;

  editIndex: number|null = null;
  editedRecord: IAttendance|null = null;

  editRecord(index: number) {
    this.editIndex = index;
    this.editedRecord = { ...this.records[index] };
  }

  saveRecord(index: number) {
    if (this.editedRecord) {
      this.subs.push(this.attendanceService.editAttendance(this.editedRecord).subscribe({
        next: (resp) => {
          this.records[index] = resp;
          this.editIndex = null;
          this.editedRecord = null;
          console.log(this.records[index]);
          console.log(resp);

          
          Swal.fire({
            title: "Success!",
            text: "Record has been updated successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
          
          this.cdr.detectChanges();
        },
        error: (err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to update record. Please try again.",
          });
          this.error = 'Failed to update record.';
        }
      }));
    }
  }

  cancelEdit() {
    this.editIndex = null;
    this.editedRecord = null;
  }

  deleteRecord(index: number) {
    
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.subs.push(this.attendanceService.deleteAttendance(this.records[index].attendanceId).subscribe({
          next: (resp) => {
            Swal.fire({
              title: "Deleted!",
              text: "Record has been deleted.",
              icon: "success"
            });
            this.records.splice(index, 1);
            if (this.editIndex === index) {
              this.editIndex = null;
              this.editedRecord = null;
            }
            this.cdr.detectChanges();
          },
          error: (err) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
            this.error = 'Failed to delete record.';
          }
        }));
      }
    });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
} 