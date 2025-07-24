import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepartmentService } from '../../../Services/department-service';
import { IDepartment } from '../../../Interfaces/idepartment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css'
})
export class Departments implements OnInit, OnDestroy {
  departments: IDepartment[] = [];
  showAddForm = false;
  loading = false;
  formLoading = false;
  error: string | null = null;
  departmentForm!: FormGroup;
  subs: Subscription[] = [];

  constructor(
    private departmentService: DepartmentService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
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

  loadDepartments() {
    this.loading = true;
    this.subs.push(this.departmentService.getDepartments().subscribe({
      next: (departments: IDepartment[]) => {
        this.departments = departments;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load departments.';
        this.loading = false;
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
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    this.formLoading = true;
    const newDepartment: IDepartment = this.departmentForm.value;
    
    this.subs.push(this.departmentService.addDepartment(newDepartment).subscribe({
      next: (department: IDepartment) => {
        this.departments.push(department);
        this.hideAddDepartmentForm();
        this.formLoading = false;
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Failed to add department.';
        this.formLoading = false;
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
} 