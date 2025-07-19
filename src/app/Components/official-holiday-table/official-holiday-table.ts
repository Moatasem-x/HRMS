import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { OfficialHolidayService } from '../../Services/official-holiday-service';
import { IOfficialHoliday } from '../../Interfaces/iofficial-holiday';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-official-holiday-table',
  templateUrl: './official-holiday-table.html',
  styleUrl: './official-holiday-table.css',
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule, ReactiveFormsModule]
})
export class OfficialHolidayTableComponent implements OnInit, OnDestroy, OnChanges {
  holidays: IOfficialHoliday[] = [];
  isLoading = false;
  error: string | null = null;
  subs: Subscription[] = [];
  editIndex: number | null = null;
  editedHoliday: IOfficialHoliday | null = null;
  editForm: FormGroup | null = null;
  @Input() addedHoliday!: IOfficialHoliday;

  constructor(
    private holidayService: OfficialHolidayService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadHolidays();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['addedHoliday']) {
      this.holidays.push(this.addedHoliday);
      this.cdr.detectChanges();
    }
  }

  loadHolidays(): void {
    this.subs.push(this.holidayService.getOfficialHolidays().subscribe({
      next: (holidays) => {
        this.holidays = holidays;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load holidays.';
      },
      complete: () => {
      }
    }));
  }

  editHoliday(holiday: IOfficialHoliday, index: number): void {
    this.editIndex = index;
    this.editedHoliday = { ...holiday };
    this.editForm = this.fb.group({
      holidayName: [holiday.holidayName, Validators.required],
      holidayDate: [holiday.holidayDate, Validators.required],
      description: [holiday.description, Validators.required]
    });
  }

  saveHoliday(holiday: IOfficialHoliday, index: number): void {
    if (!this.editForm || this.editForm.invalid) {
      this.editForm?.markAllAsTouched();
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Update the holiday details!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!"
    }).then((result) => {
      if (result.isConfirmed) {

        const updatedHoliday: IOfficialHoliday = {
          ...this.editForm?.value,
          holidayId: holiday.holidayId
        };
        this.subs.push(this.holidayService.editOfficialHoliday(updatedHoliday, updatedHoliday.holidayId).subscribe({
          next: (resp) => {
            Swal.fire({
              title: "Updated!",
              text: "Holiday has been updated.",
              icon: "success"
            });
            this.holidays[index] = resp || updatedHoliday;
            this.editIndex = null;
            this.editedHoliday = null;
            this.editForm = null;
            this.cdr.detectChanges();
          },
          error: (err) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
            this.error = 'Failed to update holiday.';
          }
        }));
      }
    });
  }

  cancelEdit(): void {
    this.editIndex = null;
    this.editedHoliday = null;
    this.editForm = null;
  }

  deleteHoliday(holidayId: number): void {
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
        this.subs.push(this.holidayService.deleteOfficialHoliday(holidayId).subscribe({
          next: (resp) => {
            Swal.fire({
              title: "Deleted!",
              text: "Holiday has been deleted.",
              icon: "success"
            });
            this.holidays = this.holidays.filter(holiday => holiday.holidayId !== holidayId);
            this.cdr.detectChanges();
          },
          error: (err) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
            this.error = 'Failed to delete holiday.';
          }
        }));
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
} 