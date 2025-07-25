import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, style, animate, transition, query, group } from '@angular/animations';
import { OfficialHolidayService } from '../../../Services/official-holiday-service';
import { IOfficialHoliday } from '../../../Interfaces/iofficial-holiday';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-official-holiday-combine',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './official-holiday-combine.html',
  styleUrls: ['./official-holiday-combine.css'],
  animations: [
    trigger("expand",[
      transition(":enter", [
        style({height: 0,opacity: 0}),
        query(".details",[
          style({translate: "0 -100%"})
        ]),
        group([
          animate("0.8s cubic-bezier(0.4, 0, 0.2, 1)", style({height: "*", opacity: 1})),
          query(".details",[
            animate("0.8s cubic-bezier(0.4, 0, 0.2, 1)", style({translate: "0 0"}))
          ])
        ])
      ]),
      transition(":leave",[
        style({height: "*", opacity: 1}),
        query(".details",[
          style({translate: "0 0"})
        ]),
        group([
          animate("0.8s cubic-bezier(0.4, 0, 0.2, 1)", style({height: 0,opacity: 0})),
          query(".details",[
            animate("0.8s cubic-bezier(0.4, 0, 0.2, 1)", style({translate: "0 -100%"}))
          ])
        ])
      ])
    ])
  ]
})
export class OfficialHolidayCombine implements OnInit, OnDestroy {
  holidays: IOfficialHoliday[] = [];
  isLoading = false;
  error: string | null = null;
  subs: Subscription[] = [];
  editIndex: number | null = null;
  editedHoliday: IOfficialHoliday | null = null;
  editForm: FormGroup | null = null;

  // New properties for grouping and search
  searchTerm = '';
  selectedYear = '';
  expandedGroups = new Set<string>([]);
  isNavigatingAway = false;

  // Form properties
  showAddForm = false;
  holidayForm!: FormGroup;
  isSubmitting = false;

  // Year options
  years: number[] = [];

  constructor(
    private holidayService: OfficialHolidayService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    // Generate years from 2020 to current year + 1
    const currentYear = new Date().getFullYear();
    for (let year = 2020; year <= currentYear + 1; year++) {
      this.years.push(year);
    }
  }

  ngOnInit(): void {
    this.spinner.show();
    this.initForm();
    this.loadHolidays();
  }

  initForm() {
    this.holidayForm = this.fb.group({
      holidayName: ['', Validators.required],
      holidayDate: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  // Get year groups for grouping
  get yearGroups(): string[] {
    const allYears = this.holidays.map(h => new Date(h.holidayDate).getFullYear().toString());
    return ['All', ...Array.from(new Set(allYears)).sort((a, b) => parseInt(b) - parseInt(a))];
  }

  // Get grouped holidays
  get groupedHolidays(): { [group: string]: IOfficialHoliday[] } {
    const groups: { [group: string]: IOfficialHoliday[] } = {};
    for (const holiday of this.getHolidaysByGroup()) {
      const year = new Date(holiday.holidayDate).getFullYear().toString();
      if (!groups[year]) groups[year] = [];
      groups[year].push(holiday);
    }
    
    // Sort records within each group by date
    Object.keys(groups).forEach(year => {
      groups[year].sort((a, b) => {
        return new Date(a.holidayDate).getTime() - new Date(b.holidayDate).getTime();
      });
    });
    
    return groups;
  }

  // Group management methods
  isGroupExpanded(group: string): boolean {
    return this.expandedGroups.has(group);
  }

  toggleGroup(group: string): void {
    if (this.expandedGroups.has(group)) {
      this.expandedGroups.delete(group);
    } else {
      this.expandedGroups.add(group);
    }
  }

  // Filter holidays by search and year
  getHolidaysByGroup(): IOfficialHoliday[] {
    let filtered = this.holidays;
    
    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(h => 
        h.holidayName.toLowerCase().includes(term) ||
        h.description.toLowerCase().includes(term)
      );
    }
    
    // Apply year filter
    if (this.selectedYear) {
      filtered = filtered.filter(h => 
        new Date(h.holidayDate).getFullYear().toString() === this.selectedYear
      );
    }
    
    // Sort by date in ascending order
    return filtered.sort((a, b) => {
      return new Date(a.holidayDate).getTime() - new Date(b.holidayDate).getTime();
    });
  }

  loadHolidays(): void {
    this.subs.push(this.holidayService.getOfficialHolidays().subscribe({
      next: (holidays) => {
        this.holidays = holidays;
        this.cdr.detectChanges();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.spinner.hide();
        this.error = 'Failed to load holidays.';
      },
      complete: () => {
        this.expandedGroups.add('All');
        this.cdr.detectChanges();
        this.cdr.markForCheck();
        this.spinner.hide();
      }
    }));
  }

  showAddHolidayForm() {
    this.showAddForm = true;
    this.holidayForm.reset();
    this.error = null;
  }

  hideAddHolidayForm() {
    this.showAddForm = false;
    this.holidayForm.reset();
    this.error = null;
  }

  onSubmit() {
    if (this.holidayForm.invalid) {
      this.holidayForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const newHoliday: IOfficialHoliday = this.holidayForm.value;
    
    this.subs.push(this.holidayService.addOfficialHoliday(newHoliday).subscribe({
      next: (holiday: IOfficialHoliday) => {
        // Add the new holiday to the array
        this.holidays.push(holiday);
        // Hide the form
        this.hideAddHolidayForm();
        // Force change detection
        this.cdr.detectChanges();
        this.cdr.markForCheck();
        
        Swal.fire({
          title: "Success!",
          text: "Holiday has been added successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err: any) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to add holiday. Please try again.",
        });
        this.error = err?.error?.message || 'Failed to add holiday.';
      },
      complete: () => {
        this.isSubmitting = false;
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
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedHoliday: IOfficialHoliday = {
          ...this.editForm?.value,
          holidayId: holiday.holidayId
        };
        this.subs.push(this.holidayService.editOfficialHoliday(updatedHoliday, updatedHoliday.holidayId).subscribe({
          next: (resp) => {
            // Update the holiday in the array
            this.holidays[index] = resp || updatedHoliday;
            // Reset edit state
            this.editIndex = null;
            this.editedHoliday = null;
            this.editForm = null;
            // Force change detection
            this.cdr.detectChanges();
            this.cdr.markForCheck();
            
            Swal.fire({
              title: "Updated!",
              text: "Holiday has been updated.",
              icon: "success"
            });
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
            // Remove the holiday from the array
            this.holidays = this.holidays.filter(holiday => holiday.holidayId !== holidayId);
            // Force change detection
            this.cdr.detectChanges();
            this.cdr.markForCheck();
            
            Swal.fire({
              title: "Deleted!",
              text: "Holiday has been deleted.",
              icon: "success"
            });
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