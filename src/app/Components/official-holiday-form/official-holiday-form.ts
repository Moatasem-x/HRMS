import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OfficialHolidayService } from '../../Services/official-holiday-service';
import { IOfficialHoliday } from '../../Interfaces/iofficial-holiday';
import { Subscription } from 'rxjs';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-official-holiday-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SweetAlert2Module],
  templateUrl: './official-holiday-form.html',
  styleUrl: './official-holiday-form.css'
})
export class OfficialHolidayForm implements OnInit, OnDestroy {
  holidayForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  subs: Subscription[] = [];
  @Output() holidayEmitter = new EventEmitter<IOfficialHoliday>();

  constructor(private fb: FormBuilder, private holidayService: OfficialHolidayService, private cdr: ChangeDetectorRef) {
    
  }

  ngOnInit(): void {
    this.formInit();
  }

  formInit() {
    this.holidayForm = this.fb.group({
      holidayName: ['', Validators.required],
      holidayDate: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.holidayForm.valid) {
      this.isSubmitting = true;
      const holiday: IOfficialHoliday = this.holidayForm.value;
      this.addHoliday(holiday);
    } else {
      this.holidayForm.markAllAsTouched();
    }
  }

  addHoliday(holiday: IOfficialHoliday) {
    this.subs.push(this.holidayService.addOfficialHoliday(holiday).subscribe({
      next: (resp) => {
        Swal.fire({
          title: "Added Successfully!",
          icon: "success",
          draggable: true
        });
        this.submitSuccess = true;
        this.holidayForm.reset();
        this.cdr.detectChanges();
        this.holidayEmitter.emit(holiday);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
  
}
