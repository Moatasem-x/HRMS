import { Component, OnInit, OnDestroy, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepartmentService } from '../../../Services/department-service';
import { IDepartment } from '../../../Interfaces/idepartment';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css'
})
export class Departments implements OnInit, OnDestroy {
  departments: IDepartment[] = [];
  showAddForm = false;
  error: string | null = null;
  departmentForm!: FormGroup;
  subs: Subscription[] = [];
  editIndex: number | null = null;
  editForm!: FormGroup;

  constructor(
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.initForm();
    this.loadDepartments();
  }

  initForm() {
    this.departmentForm = this.fb.group({
      departmentName: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get departmentName() { return this.departmentForm.get('departmentName'); }
  get description() { return this.departmentForm.get('description'); }

  get nameCtrl() {
    return this.editForm ? this.editForm.get('departmentName') : null;
  }
  get descCtrl() {
    return this.editForm ? this.editForm.get('description') : null;
  }

  loadDepartments() {
    this.subs.push(this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        this.cdr.detectChanges();
        this.appRef.tick();
      },
      error: (err: any) => {
        this.error = 'Failed to load departments.';
      },
      complete: () => {
        this.spinner.hide();
      }
    }));
  }

  showAddDepartmentForm() {
    this.showAddForm = true;
    this.departmentForm.reset();
    this.error = null;
  }

  hideAddDepartmentForm() {
    this.showAddForm = false;
    this.departmentForm.reset();
    this.error = null;
  }

  onSubmit() {
    this.spinner.show();
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    const newDepartment: IDepartment = this.departmentForm.value;
    
    this.subs.push(this.departmentService.addDepartment(newDepartment).subscribe({
      next: (department: IDepartment) => {
        this.departments.push(department);
        this.hideAddDepartmentForm();
        this.cdr.detectChanges();
        Swal.fire({
          title: "Success!",
          text: "Department has been added successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err: any) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to add department. Please try again.",
        });
        this.error = err?.error?.message || 'Failed to add department.';
      },
      complete: () => {
        this.spinner.hide();
      }
    }));
  }

  deleteDepartment(departmentId: number) {
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
        this.subs.push(this.departmentService.deleteDepartment(departmentId).subscribe({
          next: () => {
            this.departments = this.departments.filter(d => d.departmentId != departmentId);
            this.cdr.detectChanges();
            Swal.fire({
              title: "Success!",
              text: "Department has been deleted successfully.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: () => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Failed to delete department. Please try again.",
            });
          }
        }));
      }
    });
  }

  startEditDepartment(index: number) {
    this.editIndex = index;
    const dept = this.departments[index];
    this.editForm = this.fb.group({
      departmentName: [dept.departmentName, [Validators.required, Validators.minLength(2)]],
      description: [dept.description, [Validators.required, Validators.minLength(10)]]
    });
  }

  cancelEditDepartment() {
    this.editIndex = null;
  }

  saveEditDepartment(index: number) {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    const updated: IDepartment = {
      ...this.departments[index],
      departmentName: this.editForm.value.departmentName,
      description: this.editForm.value.description
    };
    this.subs.push(this.departmentService.editDepartment(updated).subscribe({
      next: (resp) => {
        this.departments[index] = resp;
        this.editIndex = null;
        this.cdr.detectChanges();
        Swal.fire({
          title: "Success!",
          text: "Department has been updated successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: () => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to update department. Please try again.",
        });
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
} 